'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const getUser = require('./userGet');

const updateUserCards = (user, cardId) => {
  // console.log("user.cards", user.cards);
  // console.log("user.cards[0].id", typeof user.cards[0].id, "cardId", typeof cardId);
  // console.log(user.cards[0].id === cardId);
  
  let card = _.find(user.cards, {id: cardId});
  
  if (card === undefined){
    card = {id: cardId, stampCount: 0};
    user.cards.push(card);
  }
  
  card.stampCount++;
  card.lastStampAt = Math.trunc(new Date().getTime()/1000);
  return user.cards;
};

const updateDB = (userId, newCards, newUser) => {// Todo update just one card instead of all user's cards
  // console.log("newCards", newCards);
  return new Promise((resolve, reject) => {
    let params = {
      TableName: UserTable,
      Key: {id: userId},
      UpdateExpression: "set cards = :cards",
      ExpressionAttributeValues:{
        ":cards":newCards,
      },
      ReturnValues:"UPDATED_NEW"
    };
    docClient.update(params, (err, data) => {
      if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("Item Updated successfully");
        // console.log("data", data);
        resolve(newUser);
      }
    });
  });
  
};

const stampCard = (userId, cardId, pin) => {
  // console.log("strampCard userId, cardId, pin", userId, cardId, pin);
  let newUser;
  if (pin === "2587"){
    return getUser(userId)
        .then(user => {
          newUser = user;
          return updateUserCards(user, cardId)
        })
        .then(newCards => {
          newUser.cards = newCards;
          return updateDB(userId, newCards, newUser)
        })
  } else {
    throw new Error('Invalid PIN');
  }
};

module.exports = stampCard;