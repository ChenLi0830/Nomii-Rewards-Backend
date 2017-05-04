'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const getUser = require('./CRUD/userGet');

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
        console.error("Unable to remove user ownedRestaurants. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("User ownedRestaurant remove successfully");
        // console.log("data", data);
        resolve(data.Attributes);
      }
    });
  });
};

const userRestaurantOwnershipRemove = (userId, restaurantId) => {
  
  return getUser(userId)
      .then(user => {
        // check if the user already owns the restaurant
        const restaurantIndex = _.findIndex(user.ownedRestaurants, (id) => id === restaurantId);
        if (restaurantIndex < 0) return Promise.reject(new Error("User doesn't own this restaurant"));
        
        // calculate newOwnedRestaurants
        let ownedRestaurants = user.ownedRestaurants;
        ownedRestaurants.splice(restaurantIndex, 1);
        // console.log("ownedRestaurants", ownedRestaurants);
        
        // update DB
        return updateUserTable(userId, ownedRestaurants);
      });
};

module.exports = userRestaurantOwnershipRemove;



