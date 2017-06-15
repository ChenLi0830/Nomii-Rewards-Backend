'use strict';
const _ = require('lodash');
const getRestaurant = require('./CRUD/restaurantGet');
const updateRestaurant = require('./CRUD/restaurantUpdate');

const restaurantHasSamePIN = (restaurant, PINCode) => {
  const PIN = _.find(restaurant.PINs, {code: PINCode});
  return !!PIN;
};

const restaurantPINEdit = (restaurantId, oldPIN, newPIN, employeeName) => {
  console.log("restaurantPINCreate start");
  return getRestaurant(restaurantId)
      .then(restaurant => {
        // calculate newPINs
        let newPINs = JSON.parse(JSON.stringify(restaurant.PINs));
        let PINRecord = _.find(newPINs, {code: oldPIN});
        
        if (!PINRecord) throw new Error("Can't find the PIN you're trying to edit");
        
        PINRecord.code = newPIN;
        PINRecord.employeeName = employeeName.trim();
        PINRecord.id = newPIN;
  
        // update DB
        return updateRestaurant(restaurantId, {PINs: newPINs});
      });
};

module.exports = restaurantPINEdit;

