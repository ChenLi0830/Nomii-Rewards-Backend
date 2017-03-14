'use strict';
const getAllRestaurants = require('./getAllRestaurants');
const _ = require('lodash');

const getRestaurant = (id) => {
  const allRestaurants = getAllRestaurants();
  return _.find(allRestaurants, {id: id});
};

module.exports = getRestaurant;