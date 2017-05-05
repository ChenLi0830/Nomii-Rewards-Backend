'use strict';
const _ = require('lodash');
const getRestaurant = require('./CRUD/restaurantGet');
const updateRestaurant = require('./CRUD/restaurantUpdate');

const restaurantPINRemove = (restaurantId, PINCode) => {
  console.log("restaurantPINRemove start");
  return getRestaurant(restaurantId)
      .then(restaurant => {
        // check duplicate
        const PINIndex = _.findIndex(restaurant.PINs, {code: PINCode});
        if (PINIndex < 0) return Promise.reject(new Error("The PIN doesn't exit"));
        // calculate newPINs
        let newPINs = restaurant.PINs;
        newPINs.splice(PINIndex,1);
        // update DB
        return updateRestaurant(restaurantId, {PINs: newPINs});
      });
};

module.exports = restaurantPINRemove;



