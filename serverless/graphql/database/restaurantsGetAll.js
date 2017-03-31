'use strict';
const RestaurantTable = require('./config').RestaurantTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Get all restaurants in the RestaurantTable
 * */
const getAllRestaurants = () => {
  const params = {
    TableName: RestaurantTable,
  };
  
  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to get all restaurants. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      let restaurants = data.Items;
      // console.log("user", user);
      // if (!user) user = {};
      // console.log("Scan restaurants succeeded:", JSON.stringify(restaurants));
      resolve(restaurants);
    });
  });
};


module.exports = getAllRestaurants;