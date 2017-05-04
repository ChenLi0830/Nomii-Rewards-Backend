'use strict';
const _ = require('lodash');
const uuidV4 = require('uuid/v4');
const RestaurantTable = require('../config').RestaurantTable;
const create = require('./create');
const getAllRestaurants = require('./restaurantsGetAll');

const createRestaurant = (args) => {
  if (!args.stampValidDays) args.stampValidDays = 21;
  
  return getAllRestaurants()
      .then(restaurants => {
        // Check duplication
        const dupRestaurant = _.find(restaurants, {
          name: args.name,
          longitude: args.longitude,
          latitude: args.latitude}
          );
        if (dupRestaurant) {
          return Promise.reject(new Error("A restaurant with the same name and location already exists"));
        }
        
        // Create restaurant
        args.id = uuidV4();
        args.PINs = [];
        
        return create(RestaurantTable, args);
      });
};

module.exports = createRestaurant;