'use strict';
const RestaurantTable = require('../config').RestaurantTable;
const update = require('./update');

const updateRestaurant = (id, newFields, options = {}) => {
  return update(RestaurantTable, {id}, newFields, options)
};

module.exports = updateRestaurant;