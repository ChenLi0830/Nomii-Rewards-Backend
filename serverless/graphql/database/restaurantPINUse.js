'use strict';
const _ = require('lodash');
const getRestaurant = require('./CRUD/restaurantGet');
const updateRestaurant = require('./CRUD/restaurantUpdate');

const useRestaurantPIN = (restaurantId, PINCode) => {
  console.log("useRestaurantPIN start");
  return getRestaurant(restaurantId)
      .then(restaurant => {
        // calculate newPINs
        let PIN = _.find(restaurant.PINs, {code: PINCode});
        PIN.usageCount++;
        // update DB
        return updateRestaurant(restaurantId, {PINs:restaurant.PINs});
      });
};

module.exports = useRestaurantPIN;
