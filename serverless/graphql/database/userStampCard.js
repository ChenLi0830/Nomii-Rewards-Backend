'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const getUser = require('./userGet');
const getRestaurant = require('./restaurantGet');
const userVisitedRestaurantBefore = require('./userVisitedRestaurantBeforeCheck');
const useRestaurantPIN = require('./restaurantPINUse');
const createStampEvent = require('./stampEventCreate');
const api = require('../api');

// const userVisitRestaurant = (user, restaurantId) => {
//   let visitedRestaurants = user.visitedRestaurants;
//   visitedRestaurants.push(restaurantId);
//
//   return new Promise((resolve, reject) => {
//     let params = {
//       TableName: UserTable,
//       Key: {id: user.id},
//       UpdateExpression: "SET visitedRestaurants = :visitedRestaurants",
//       ExpressionAttributeValues: {
//         ":visitedRestaurants": visitedRestaurants,
//       },
//       ReturnValues: "ALL_NEW"
//     };
//     docClient.update(params, (err, data) => {
//       if (err) {
//         console.error("Unable to update item. Error JSON:", JSON.stringify(err), err.stack);
//         return reject(err);
//       } else {
//         console.log("User visitedRestaurants Updated successfully");
//         // console.log("data", data);
//         resolve(data.Attributes);
//       }
//     });
//   });
// };

const calcUserCards = (user, cardId) => {
  let cardIndex = _.findIndex(user.cards, {id: cardId});
  let card;
  
  //User doesn't have that card
  if (cardIndex < 0) {
    card = {id: cardId, stampCount: 1, lastStampAt: api.getTimeInSec()};
    user.cards.push(card);
  }
  // Card is used up
  else if (user.cards[cardIndex].stampCount >= 2) {
    user.cards.splice(cardIndex, 1);
  }
  // Add stamp to card
  else {
    user.cards[cardIndex].stampCount++;
    user.cards[cardIndex].lastStampAt = api.getTimeInSec();
  }
  
  return Promise.resolve(user.cards);
};

const updateUserTable = (user, newCards, visitedRestaurants) => {
  // Todo update just one card instead of all user's cards
  
  return new Promise((resolve, reject) => {
    let params = {
      TableName: UserTable,
      Key: {id: user.id},
      UpdateExpression: "set cards = :cards, visitedRestaurants = :visitedRestaurants",
      ExpressionAttributeValues: {
        ":cards": newCards,
        ":visitedRestaurants": visitedRestaurants,
      },
      ReturnValues: "ALL_NEW"
    };
    docClient.update(params, (err, data) => {
      if (err) {
        console.error("Unable to stamp card for user. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("User stamped card successfully");
        // console.log("data.Attributes", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
};

const stampCard = (userId, cardId, PINCode) => {
  // console.log("strampCard userId, cardId, pin", userId, cardId, pin);
  return getRestaurant(cardId)
      .then(restaurant => {
        // Check PIN exist
        const PIN = _.find(restaurant.PINs, {code: PINCode});
        if (!PIN || !PIN.code) return Promise.reject(new Error('Invalid PIN'));
        
        return getUser(userId)
            .then(user => {
              return calcUserCards(user, cardId)
                  .then(newCards => {
                    let visitedRestaurants = user.visitedRestaurants;
                    const isNewUser = !userVisitedRestaurantBefore(user, cardId);
                    if (isNewUser) {
                      visitedRestaurants.push(cardId);
                    }
                    return Promise.all([
                      updateUserTable(user, newCards, visitedRestaurants),
                      useRestaurantPIN(cardId, PINCode),
                      createStampEvent(cardId, userId, restaurant.name, isNewUser, PINCode, PIN.employeeName, user.fbName),
                    ])
                        .then(results => {
                          // console.log("results", results);
                          return results[0];
                        });
                  })
            })
      });
};

module.exports = stampCard;