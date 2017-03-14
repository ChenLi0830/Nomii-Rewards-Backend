'use strict';
const getAllRestaurants = require('./getAllRestaurants');
const _ = require('lodash');

const getRestaurant = (id) => {
  return getAllRestaurants()
      .then(allRestaurants => {
        console.log("allRestaurants", allRestaurants);
        const restaurant =_.find(allRestaurants, {id: id});
        if (restaurant) return restaurant;
        else return Promise.reject(new Error(`restaurant with id ${id} doesn't exist`));
      });
};

module.exports = getRestaurant;