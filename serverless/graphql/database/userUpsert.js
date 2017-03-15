'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const getUser = require('./userGet');
const api = require('../api');

const insertUserToDB = (user) => {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: UserTable,
      Item: user,
      // ReturnConsumedCapacity: "TOTAL",
    };
    docClient.put(params, (err, data) => {
      if (err) {
        console.error("Unable to insert user. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("User inserted successfully");
        resolve(user);
      }
    });
  })
};

const updateUserInDB = (user) => {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: UserTable,
      Key: {
        "id": user.id,
      },
      UpdateExpression: "SET lastLoginAt = :time",
      ExpressionAttributeValues: {
        ":time": api.getTimeInSec(),
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

const upsertUser = (id, fbName) => {
  return getUser(id)
      .then(user => {
        //Create user
        if (!user || !user.id) {
          user = {
            id,
            fbName,
            registeredAt: api.getTimeInSec(),
            lastLoginAt: api.getTimeInSec(),
            cards: [],
            usedCards: [],
            redeemedCoupons: [],
            visitedRestaurants: [],
            ownedRestaurants: [],
          };
          console.log("insertUserToDB", user);
          return insertUserToDB(user);
        }
        // Update user
        else {
          user.lastLoginAt = api.getTimeInSec();
          console.log("updateUserInDB", user);
          return updateUserInDB(user);
        }
      });
};

module.exports = upsertUser;