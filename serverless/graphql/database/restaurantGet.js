'use strict';
const RestaurantTable = require('./config').RestaurantTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const getRestaurant = (id) => {
  let params = {
    TableName: RestaurantTable,
    Key: {
      id: id
    },
  };
  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        console.error("Unable to get restaurant. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      console.log("data.Item", data.Item);
      const restaurant = data.Item;
      resolve(restaurant);
    });
  });
};

module.exports = getRestaurant;