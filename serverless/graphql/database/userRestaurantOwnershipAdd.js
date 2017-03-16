'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const getUser = require('./userGet');
const userOwnRestaurant = require('./userOwnRestaurantCheck');

const updateUserTable = (userId, ownedRestaurants) => {
  
  let params = {
    TableName: UserTable,
    Key: {id: userId},
    UpdateExpression: "SET ownedRestaurants = :ownedRestaurants",
    ExpressionAttributeValues: {
      ":ownedRestaurants": ownedRestaurants,
    },
    ReturnValues: "ALL_NEW"
  };
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error("Unable to update user ownedRestaurants. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("User ownedRestaurants updated successfully");
        // console.log("data", data);
        resolve(data.Attributes);
      }
    });
  });
};

const userRestaurantOwnershipAdd = (userId, restaurantId) => {
  
  return getUser(userId)
      .then(user => {
        // check if the user already owns the restaurant
        if (userOwnRestaurant(user, restaurantId)) return user;
  
        // calculate newOwnedRestaurants
        let ownedRestaurants = user.ownedRestaurants;
        ownedRestaurants.push(restaurantId);
        
        // update DB
        return updateUserTable(userId, ownedRestaurants);
      });
};

module.exports = userRestaurantOwnershipAdd;



