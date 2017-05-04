'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const getUser = require('./CRUD/userGet');
const createUser = require('./CRUD/userCreate');
const api = require('../api');

const updateUserInDB = (user) => {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: UserTable,
      Key: {
        "id": user.id,
      },
      UpdateExpression: "SET lastLoginAt = :lastLoginAt, fbName = :fbName, #token = :token",
      ExpressionAttributeNames: {
        "#token" : "token",
      },
      ExpressionAttributeValues: {
        ":lastLoginAt": user.lastLoginAt,
        ":fbName": user.fbName,
        ":token": user.token,
      },
      ReturnValues: "ALL_NEW",
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

const upsertUser = (id, fbName, token) => {
  const time = api.getTimeInSec();
  return getUser(id)
      .then(user => {
        //Create user
        if (!user || !user.id) {
          user = {
            id,
            fbName,
            token,
            registeredAt: time,
            lastLoginAt: time,
            cards: [],
            usedCards: [],
            redeemedCoupons: [],
            visitedRestaurants: [],
            ownedRestaurants: [],
            awaitFeedbacks:[],
          };
          console.log("insertUserToDB - id, fbName", user.id, user.fbName);
          return createUser(user);
        }
        // Update user
        else {
          user.lastLoginAt = api.getTimeInSec();
          user.fbName = fbName;
          user.token = token;
          // console.log("updateUserInDB", user);
          return updateUserInDB(user);
        }
      });
};

module.exports = upsertUser;