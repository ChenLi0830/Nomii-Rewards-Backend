'use strict';
const api = require('../api');

const getUser = require('./CRUD/userGet');
const updateUser = require('./CRUD/userUpdate');

const userAwaitFeedbackAdd = (args) => {
  console.log("userAwaitFeedbackAdd start");
  const {
    userId,
    restaurantId,
    stampCountOfCard,
    employeeName,
  } = args;
  
  return getUser(userId)
      .then(user => {
        //calc new newFeedback
        let newFeedback = {
          userId,
          restaurantId,
          visitedAt: api.getTimeInSec(),
          stampCountOfCard,
          employeeName,
        };
  
        //update user
        if (user.awaitFeedbacks) {
          return updateUser(userId, {awaitFeedbacks: [...user.awaitFeedbacks, newFeedback]})
        } else {
          return updateUser(userId, {awaitFeedbacks: [newFeedback]})
        }
      });
};

module.exports = userAwaitFeedbackAdd;