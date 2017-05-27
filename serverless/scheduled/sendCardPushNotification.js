'use strict';
let AWS = require('../graphql/database/config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const Expo = require('exponent-server-sdk');
const _ = require('lodash');

const UserTable = require('../graphql/database/config').UserTable;
const api = require('../graphql/api');
const restaurantsGetAll = require('../graphql/database').restaurantsGetAll;
const usersGetAll = require('../graphql/database').usersGetAll;

let restaurantsMap;
let users;
let notificationList;
let newUsers;

const calcRemainedDays = (lastStampAt, stampValidDays) => {
  // If expired, return -1;
  if (lastStampAt + stampValidDays * 24 * 3600 < api.getTimeInSec()) return -1;
  return Math.ceil((parseInt(lastStampAt) + stampValidDays * 24 * 3600 - api.getTimeInSec())/(3600 * 24));
};

const shouldNotifyCard = (expireInDays, lastNotificationAt, notifiedTimes, stampValidDays) => {
  // Card is already expired, notification should not be sent
  if (expireInDays<0) return false;
  
  /* strategy 1 - based */
  // let urgency = api.getUrgency(stampValidDays, expireInDays);
  // let notificationIntervalInHour = (api.getTimeInSec() - lastNotificationAt) / (3600);
  //
  // // Notification should wait for at least 24 hours
  // // A card should be notified for at most 2 times
  // // A card should be notified only when it is very urgent
  // return notificationIntervalInHour >= 24 && notifiedTimes < 2 && urgency === 0;
  
  /* strategy 2 - based on expireInDays */
  if (stampValidDays <= 7){
    return _.includes([1, 3], expireInDays);
  } else if (stampValidDays <= 14){
    return _.includes([1, 3, 5, 7], expireInDays);
  } else if (stampValidDays <= 30){
    return _.includes([1, 3, 5, 10], expireInDays);
  }
};

const calcNotificationAndUsers = (users) => {
  users.forEach(user => {
    // pass the user if he/she doesn't have pushTokens
    if (!user.pushTokens) return;
    
    // get newUserCards with updated lastNotificationAt and notifiedTimes field &&
    // add ready to be sent notifications into notificationList
    let userShouldUpdate = false;
    let newUserCards = user.cards.map(card => {
      //id, lastStampAt, stampCount, lastNotificationAt, notifiedTimes, user.pushTokens
      const restaurant = restaurantsMap.get(card.id);
      
      let expireInDays = calcRemainedDays(~~card.lastStampAt, restaurant.stampValidDays);
      // console.log("expireInDays", expireInDays);
      let shouldNotify = shouldNotifyCard(expireInDays, ~~card.lastNotificationAt, ~~card.notifiedTimes, restaurant.stampValidDays);
      // console.log("shouldNotify", shouldNotify);
      
      if (shouldNotify){
        //Mark that this user needs to be updated
        userShouldUpdate = true;
        
        let userFirstName = user.fbName.trim().split(" ")[0];
        // console.log("userFirstName", userFirstName);
        
        let discount = card.stampCount === 1 && "5%" || card.stampCount === 2 && "10%" || "stamp";
        // console.log("discount", discount);
        
        let emoji = (expireInDays <= 3 ? String.fromCodePoint(128293) : String.fromCodePoint(9203)) + (expireInDays === 1 ? String.fromCodePoint(128561)+String.fromCodePoint(128561) : "");
        
        let message = `${userFirstName.length ? userFirstName + ", your" : "Your"} reward at ${restaurant.name} expires in ${expireInDays} ${expireInDays>1 ? "days" : "day"} ${emoji}`;
        // let message = `${userFirstName.length ? userFirstName : "Hey"}, your ${discount} discount expires in ${expireInDays} ${expireInDays>1 ? "days" : "day"} ${String.fromCodePoint(128293)}`;
        console.log("message: ", message);
        
        user.pushTokens.forEach(pushToken => {
          // console.log("pushToken", pushToken);
          // Add notification to list if the token is valid
          if (Expo.isExponentPushToken(pushToken)){
            notificationList.push({
              // The push token for the app user to whom you want to send the notification
              to: pushToken,
              sound: 'default',
              // title: `${userFirstName.length ? userFirstName : "Hey"}, don't miss out!`,
              body: message,
              // data: {withSome: 'data'},
              // ttl: 3600*24,
              // priority: "high",
            })
          }
        });
        
        card.lastNotificationAt = api.getTimeInSec();
        card.notifiedTimes = ~~card.notifiedTimes + 1;
      }
      
      return card;
    });
    
    // keep track of which users need to be updated
    if (userShouldUpdate) {
      // console.log("userShouldUpdate", userShouldUpdate);
      user.cards = newUserCards;
      user.lastNotificationAt = api.getTimeInSec();
      
      newUsers.push(user);
    }
  });
};

const updateUserTable = (user) => {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: UserTable,
      Key: {
        "id": user.id,
      },
      UpdateExpression: "SET cards = :newCards, lastNotificationAt = :lastNotificationAt",
      ExpressionAttributeValues: {
        ":newCards": user.cards,
        ":lastNotificationAt": user.lastNotificationAt,
      },
      ReturnValues: "NONE",
    };
    docClient.update(params, (err, data) => {
      if (err) {
        console.error("Unable to update user. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("User updated successfully");
        resolve(user);
      }
    });
  })
};

const sendCardPushNotification = (event, context, callback) => {
  restaurantsMap = new Map();
  notificationList = [];
  newUsers = [];
  
  Promise.all([
    restaurantsGetAll(),
    usersGetAll({projectionExpression:'id, cards, fbName, pushTokens'}),
  ])
      .then(results => {
        const restaurants = results[0];
        users = results[1];
        
        // console.log("users", users);
        console.log(`Calc notifications for ${users.length} users`);
        
        for (let restaurant of restaurants){
          restaurantsMap.set(restaurant.id, restaurant);
        }
      })
      .then(()=>{
        calcNotificationAndUsers(users)
      })
      .then(() => {
        //updateUserTables
        let promises = newUsers.map(user => {
          return updateUserTable(user);
        });
        console.log(`${promises.length} users will be notified`);
        return Promise.all(promises);
      })
      .then((result) => {
        let expo = new Expo();
        console.log("notificationList", JSON.stringify(notificationList));
        // console.log("newUsers", newUsers);
        // console.log("newUsers[0].cards", newUsers[0].cards);
        let chuckNotifications = expo.chunkPushNotifications(notificationList);
        console.log("chuckNotifications.length", chuckNotifications.length);

        return chuckNotifications.forEach(notificationsChunk => {
          expo.sendPushNotificationsAsync(notificationsChunk)
              .then(receipts => {
                console.log(receipts);
              })
        });
      })
      .then(() => {
        let response = {
          statusCode: 200,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({
            message: `${notificationList.length} push notifications sent out to ${newUsers.length} users`,
          }),
        };
        
        callback(null, response);
      })
      .catch(error => {
        console.log("error", error);
      });
};

module.exports = sendCardPushNotification;