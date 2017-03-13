'use strict';
'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const getAllCards = require('./getAllCards');
const getUser = require('./getUser');

const updateCardEdges = (user) => {
  let allCards = getAllCards();
  let userCardEdges = user.cards;
  let idEdgeMap = new Map();
  
  userCardEdges.forEach(card => {
    idEdgeMap.set(card.id, card);
  });
  
  allCards.forEach(card => {
    if (idEdgeMap.has(card.id) && typeof idEdgeMap.get(card.id).lastStampAt === "string") {
      // let oldEdge = idEdgeMap.get(card.id);
      // oldEdge.stampCount++;
    } else {
      idEdgeMap.set(card.id, {
        id: card.id,
        stampCount: 1,
      });
    }
  });

  const cardEdges = Array.from(idEdgeMap.values());
  // console.log("cardEdges", cardEdges);
  return cardEdges;
};

const updateDB = (newCardEdges, userId, newUser) => {
  // console.log("newCardEdges", newCardEdges);
  
  return new Promise((resolve, reject) => {
    let params = {
      TableName: UserTable,
      Key: {id: userId},
      UpdateExpression: "set cards = :cards",
      ExpressionAttributeValues:{
        ":cards":newCardEdges,
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

const addPromoToUser = (userId, code) => {
  // console.log("addPromoToUser userId, code", userId, code);
  let newUser;
  if (code === "code"){
    return getUser(userId)
        .then(user => {
          newUser = user;
          return updateCardEdges(user)
        })
        .then(newCardEdges => {
          newUser.cards = newCardEdges;
          return updateDB(newCardEdges, userId, newUser)
        });
  } else {
    throw new Error('Invalid Code');
  }
};

module.exports = addPromoToUser;