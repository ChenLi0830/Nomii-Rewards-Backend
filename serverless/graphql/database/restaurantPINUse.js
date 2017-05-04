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
        console.log("new PIN Count Updated successfully");
        // console.log("data", data);
        resolve(data.Attributes.PINs);
      }
    });
  });
};

const useRestaurantPIN = (restaurantId, PINCode) => {
  return getRestaurant(restaurantId)
      .then(restaurant => {
        // calculate newPINs
        let PIN = _.find(restaurant.PINs, {code: PINCode});
        PIN.usageCount++;
        // update DB
        return updateRestaurantTable(restaurantId, restaurant.PINs);
      });
};

module.exports = useRestaurantPIN;



