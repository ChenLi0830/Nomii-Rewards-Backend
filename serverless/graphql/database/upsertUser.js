'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const api = require('../api');

const getUserFromDB = (id)=>{
  let params = {
    TableName: UserTable,
    Key: {
      id: id
    },
  };
  
  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        console.error("Unable to get user. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      let user = data.Item;
      console.log("user", user);
      // console.log("GetItem succeeded:", JSON.stringify(item));
      resolve(user);
    });
  })
};

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
  return getUserFromDB(id)
      .then(user => {
        //Create user
        if (!user) {
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