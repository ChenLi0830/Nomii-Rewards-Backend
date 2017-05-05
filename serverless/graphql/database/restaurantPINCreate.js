'use strict';
const _ = require('lodash');
const getRestaurant = require('./CRUD/restaurantGet');
const updateRestaurant = require('./CRUD/restaurantUpdate');

const restaurantHasSamePIN = (restaurant, PINCode) => {
  const PIN = _.find(restaurant.PINs, {code: PINCode});
  return !!PIN;
};

const restaurantPINCreate = (restaurantId, PINCode, employeeName) => {
  console.log("restaurantPINCreate start");
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
        return updateRestaurant(restaurantId, {PINs: newPINs});
      });
};

module.exports = restaurantPINCreate;

