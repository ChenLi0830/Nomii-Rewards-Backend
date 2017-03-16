'use strict';
const _ = require('lodash');

const userOwnRestaurantCheck = (user, restaurantId) => {
  const ownRestaurant = _.find(user.ownedRestaurants, (id) => {
    return id === restaurantId
  });
  // console.log("ownRestaurant", ownRestaurant);
  return !!ownRestaurant;// Returns true if user own the restaurant
};

module.exports = userOwnRestaurantCheck;