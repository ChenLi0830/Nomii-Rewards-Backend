'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const getUser = require('./CRUD/userGet');

const updateUserTable = (userId, newPushTokens) => {
  let params = {
    TableName: UserTable,
    Key: {id: userId},
    UpdateExpression: "SET pushTokens = :newPushTokens",
    ExpressionAttributeValues: {
      ":newPushTokens": newPushTokens,
    },
    ReturnValues: "ALL_NEW"
  };
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error("Unable to add user pushToken. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("User pushToken added successfully");
        // console.log("data", data);
        resolve(data.Attributes);
      }
    });
  });
};

const userPushTokenUpsert = (userId, pushToken) => {
  
  return getUser(userId)
      .then(user => {
        let newPushTokens;
        
        // calculate newPushTokens
        const hasPushToken = !!_.find(user.pushTokens, (token) => {
          return token === pushToken
        });
        // return if user already has the pushToken
        if (hasPushToken) {
          return user;
        }
        newPushTokens = user.pushTokens;
        if (!newPushTokens) newPushTokens = [];
        newPushTokens.push(pushToken);
        
        // update DB
        return updateUserTable(userId, newPushTokens);
      });
};

module.exports = userPushTokenUpsert;