'use strict';
let AWS = require('./config').AWS;
const api = require('../api');

const getUser = require('./userGet');
const updateUser = require('./userUpdate');

const userAwaitFeedbackAdd = (args) => {
  const {
    userId,
    restaurantId,
    stampDiscount,
    employeeName,
  } = args;
  
  return getUser(userId)
      .then(user => {
        //calc new newFeedback
        let newFeedback = {
          userId,
          restaurantId,
          visitedAt: api.getTimeInSec(),
          stampDiscount,
          employeeName,
        };
  
        //update user
        if (user.awaitFeedbacks) {
          updateUser(userId, {awaitFeedbacks: [...user.awaitFeedbacks, newFeedback]})
        } else {
          updateUser(userId, {awaitFeedbacks: [newFeedback]})
        }
      });
};

module.exports = userAwaitFeedbackAdd;