'use strict';
const getAllRestaurants = require('./restaurantsGetAll');
const _ = require('lodash');

const getRestaurant = (id) => { // 改为从database getItem，而不是scan获得全部
  return getAllRestaurants()
      .then(allRestaurants => {
        console.log("allRestaurants", allRestaurants);
        const restaurant =_.find(allRestaurants, {id: id});
        if (restaurant) return restaurant;
        else return Promise.reject(new Error(`restaurant with id ${id} doesn't exist`));
      });
};

module.exports = getRestaurant;