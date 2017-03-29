'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const getUser = require('./userGet');

const updateUserTable = (userId, pushToken) => {
  let params = {
    TableName: UserTable,
    Key: {id: userId},
    UpdateExpression: "SET pushToken = :pushToken",
    ExpressionAttributeValues: {
      ":pushToken": pushToken,
    },
    ReturnValues: "ALL_NEW"
  };
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error("Unable to upsert user pushToken. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("User pushToken upserted successfully");
        // console.log("data", data);
        resolve(data.Attributes);
      }
    });
  });
};

const userPushTokenUpsert = (userId, pushToken) => {
  
  return getUser(userId)
      .then(user => {
        // calculate newOwnedRestaurants
        user.pushToken = pushToken;
        
        // update DB
        return updateUserTable(userId, pushToken);
      });
};

module.exports = userPushTokenUpsert;