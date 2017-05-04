'use strict';
const RestaurantTable = require('../config').RestaurantTable;
const getAll = require('./getAll');

const getAllRestaurants = (options = {}) => {
  return getAll(RestaurantTable, options);
};

module.exports = getAllRestaurants;