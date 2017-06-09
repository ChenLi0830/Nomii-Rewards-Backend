'use strict';
const getUser = require('./CRUD/userGet');
const createUser = require('./CRUD/userCreate');
const updateUser = require('./CRUD/userUpdate');
const api = require('../api');

const upsertUser = (id, fbName, token) => {
  console.log("upsertUser start");
  const timeStamp = api.getTimeInSec();
  return Promise.all([
    getUser(id),
    api.getUserPhotoURL(id)
  ])
      .then(result => {
        let user = result[0];
        let pictureURL = result[1];
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
            pictureURL,
          };
          console.log("insertUserToDB - id, fbName", user.id, user.fbName);
          return createUser(user);
        }
        // Update user
        else {
          // console.log("updateUserInDB", user);
          return updateUser(id, {lastLoginAt: timeStamp, fbName, token, pictureURL});
        }
      });
};

module.exports = upsertUser;