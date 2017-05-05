'use strict';
const _ = require('lodash');
const api = require('../api');

const getUser = require('./CRUD/userGet');
const updateUser = require('./CRUD/userUpdate');

const userRestaurantOwnershipRemove = (userId, restaurantId) => {
  console.log("userRestaurantOwnershipRemove start userId, restaurantId", userId, restaurantId);
  return getUser(userId)
      .then(user => {
        // check if the user already owns the restaurant
        const restaurantIndex = _.findIndex(user.ownedRestaurants, (id) => id === restaurantId);
        if (restaurantIndex < 0) return Promise.reject(new Error("User doesn't own this restaurant"));
        
        // calculate newOwnedRestaurants
        let ownedRestaurants = user.ownedRestaurants;
        ownedRestaurants.splice(restaurantIndex, 1);
        // console.log("ownedRestaurants", ownedRestaurants);
        
        // update DB
        return updateUser(userId, {ownedRestaurants});
      });
};

module.exports = userRestaurantOwnershipRemove;



