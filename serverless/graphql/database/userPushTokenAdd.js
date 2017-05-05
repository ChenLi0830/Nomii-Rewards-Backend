'use strict';
const _ = require('lodash');

const getUser = require('./CRUD/userGet');
const updateUser = require('./CRUD/userUpdate');

const userPushTokenUpsert = (userId, pushToken) => {
  console.log("userPushTokenUpsert start");
  return getUser(userId)
      .then(user => {
        let newPushTokens;
        
        // calculate newPushTokens
        const hasPushToken = !!_.find(user.pushTokens, (token) => {
          return token === pushToken
        });
        // return if user already has the pushToken
        if (hasPushToken) {
          return user;
        }
        newPushTokens = user.pushTokens;
        if (!newPushTokens) newPushTokens = [];
        newPushTokens.push(pushToken);
        
        // update DB
        return updateUser(userId, {pushTokens: newPushTokens});
      });
};

module.exports = userPushTokenUpsert;