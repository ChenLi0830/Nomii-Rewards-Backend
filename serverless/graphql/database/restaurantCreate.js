'use strict';
const RestaurantTable = require('./config').RestaurantTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const uuidV4 = require('uuid/v4');
const _ = require('lodash');
const api = require('../api');

const getAllRestaurants = require('../database/restaurantsGetAll');

const insertRestaurantToDB = (restaurant) => {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: RestaurantTable,
      Item: restaurant,
      // ReturnConsumedCapacity: "TOTAL",
    };
    docClient.put(params, (err, data) => {
      if (err) {
        console.error("Unable to insert restaurant. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("Restaurant inserted successfully");
        resolve(restaurant);
      }
    });
  })
};

const createRestaurant = (name, imageURL, longitude, latitude, description) => {
  return getAllRestaurants()
      .then(restaurants => {
        // Check duplication
        const dupRestaurant = _.find(restaurants, {name, longitude, latitude});
        if (dupRestaurant) return Promise.reject(
            new Error("A restaurant with the same name and location already exists"));
        
        // Create restaurant
        const restaurant = {
          id: uuidV4(),
          name,
          imageURL,
          longitude,
          latitude,
          description,
          createdAt: api.getTimeInSec(),
          PINs: [],
        };
        
        return insertRestaurantToDB(restaurant);
      });
};

module.exports = createRestaurant;