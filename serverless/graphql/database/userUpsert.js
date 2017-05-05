'use strict';
const getUser = require('./CRUD/userGet');
const createUser = require('./CRUD/userCreate');
const updateUser = require('./CRUD/userUpdate');
const api = require('../api');

const upsertUser = (id, fbName, token) => {
  console.log("upsertUser start");
  const timeStamp = api.getTimeInSec();
  return getUser(id)
      .then(user => {
        //Create user
        if (!user || !user.id) {
          user = {
            id,
            fbName,
            token,
            registeredAt: timeStamp,
            lastLoginAt: timeStamp,
            cards: [],
            usedCards: [],
            redeemedCoupons: [],
            visitedRestaurants: [],
            ownedRestaurants: [],
            awaitFeedbacks:[],
          };
          console.log("insertUserToDB - id, fbName", user.id, user.fbName);
          return createUser(user);
        }
        // Update user
        else {
          // console.log("updateUserInDB", user);
          return updateUser(id, {lastLoginAt: timeStamp, fbName, token});
        }
      });
};

module.exports = upsertUser;