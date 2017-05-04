'use strict';
const RestaurantTable = require('./config').RestaurantTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');
const getRestaurant = require('./CRUD/restaurantGet');

const restaurantHasSamePIN = (restaurant, PINCode) => {
  const PIN = _.find(restaurant.PINs, {code: PINCode});
  return !!PIN;
};

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
        console.log("new PIN Updated successfully");
        console.log("data", data);
        resolve(data.Attributes);
      }
    });
  });
};

const restaurantPINCreate = (restaurantId, PINCode, employeeName) => {
  return getRestaurant(restaurantId)
      .then(restaurant => {
        // check duplicate
        if (restaurantHasSamePIN(restaurant, PINCode)) {
          return Promise.reject(new Error("Restaurant already has this PIN"));
        }
        // calculate newPINs
        let newPINs = restaurant.PINs;
        newPINs.push({
          code: PINCode,
          employeeName: employeeName.trim(),
          usageCount: 0,
          id: PINCode,
        });
        // update DB
        return updateRestaurantTable(restaurantId, newPINs);
      });
};

module.exports = restaurantPINCreate;



