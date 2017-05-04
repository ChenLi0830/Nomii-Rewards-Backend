'use strict';
const RestaurantTable = require('./config').RestaurantTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');
const getRestaurant = require('./CRUD/restaurantGet');

const updateRestaurantTable = (restaurantId, newPINs) => {
  let params = {
    TableName: RestaurantTable,
    Key: {id: restaurantId},
    UpdateExpression: "SET PINs = :PINs",
    ExpressionAttributeValues: {
      ":PINs": newPINs,
    },
    ReturnValues: "ALL_NEW"
  };
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error("Unable to update restaurant PINs. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("PIN removed successfully");
        // console.log("data", data);
        resolve(data.Attributes);
      }
    });
  });
};

const restaurantPINRemove = (restaurantId, PINCode) => {
  return getRestaurant(restaurantId)
      .then(restaurant => {
        // check duplicate
        const PINIndex = _.findIndex(restaurant.PINs, {code: PINCode});
        if (PINIndex < 0) return Promise.reject(new Error("The PIN doesn't exit"));
        // calculate newPINs
        let newPINs = restaurant.PINs;
        newPINs.splice(PINIndex,1);
        console.log("newPINs", newPINs);
        // update DB
        return updateRestaurantTable(restaurantId, newPINs);
      });
};

module.exports = restaurantPINRemove;



