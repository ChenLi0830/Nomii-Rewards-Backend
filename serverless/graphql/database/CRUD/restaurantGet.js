'use strict';
const RestaurantTable = require('../config').RestaurantTable;
const get = require('./get');

const getRestaurant = (id) => {
  return get(RestaurantTable, {id});
};

module.exports = getRestaurant;