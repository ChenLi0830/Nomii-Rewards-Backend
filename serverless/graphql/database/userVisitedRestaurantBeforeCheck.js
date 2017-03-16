'use strict';
const _ = require('lodash');

const userVisitedRestaurantBefore = (user, restaurantId) => {
  const visitedRestaurant = _.find(user.visitedRestaurants, (id) => {
    return id === restaurantId
  });
  console.log("visitedRestaurant", visitedRestaurant);
  return !!visitedRestaurant;
};

module.exports = userVisitedRestaurantBefore;