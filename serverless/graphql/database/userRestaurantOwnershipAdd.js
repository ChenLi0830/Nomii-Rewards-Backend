'use strict';
const getUser = require('./CRUD/userGet');
const updateUser = require('./CRUD/userUpdate');
const userOwnRestaurant = require('./userOwnRestaurantCheck');

const userRestaurantOwnershipAdd = (userId, restaurantId) => {
  console.log("userRestaurantOwnershipAdd start userId, restaurantId", userId, restaurantId);
  return getUser(userId)
      .then(user => {
        // check if the user already owns the restaurant
        if (userOwnRestaurant(user, restaurantId)) return user;
  
        // calculate newOwnedRestaurants
        let ownedRestaurants = user.ownedRestaurants;
        ownedRestaurants.push(restaurantId);
        
        // update DB
        return updateUser(userId, {ownedRestaurants});
      });
};

module.exports = userRestaurantOwnershipAdd;



