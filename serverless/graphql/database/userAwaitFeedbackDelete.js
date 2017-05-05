'use strict';
const _ = require('lodash');
    
const getUser = require('./CRUD/userGet');
const updateUser = require('./CRUD/userUpdate');

const userAwaitFeedbackDelete = (args) => {
  console.log("userAwaitFeedbackDelete start");
  const {
    userId,
    restaurantId,
    visitedAt,
  } = args;
  
  return getUser(userId)
      .then(user => {
        let awaitFeedbacks = user.awaitFeedbacks;
        //calc new newFeedback
        let index = _.findIndex(awaitFeedbacks, {userId, restaurantId, visitedAt});
        
        if (index === -1) {
          throw new Error("awaitFeedback delete failed, item doesn't exist");
        }
        
        // delete item
        awaitFeedbacks.splice(index, 1);
  
        //update user
        return updateUser(userId, {awaitFeedbacks: awaitFeedbacks})
      });
};

module.exports = userAwaitFeedbackDelete;