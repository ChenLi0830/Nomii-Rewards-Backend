'use strict';
const api = require('../api');

const getUser = require('./CRUD/userGet');
const updateUser = require('./CRUD/userUpdate');
const createSkippedFeedback = require('./CRUD/skippedFeedbackCreate');

const userAwaitFeedbackSkip = (args) => {
  //args = {userId, feedbackId}
  const timeStamp = api.getTimeInSec();
  console.log("userAwaitFeedbackSkip start");
  const {
    userId,
  } = args;

  return getUser(userId)
      .then(user => {
        //calc new newFeedbacks
        const feedbackIndex = user.awaitFeedbacks.length-1;
        let feedback = user.awaitFeedbacks[feedbackIndex];
  
        // Skip feedback
        if (feedback.skipCount >= 2) {
          user.awaitFeedbacks.splice(feedbackIndex, 1);
          //Push skipped feedback into skippedFeedbacks
          feedback.userId = userId;
          return Promise.all([
            createSkippedFeedback(feedback),
            updateUser(userId, {awaitFeedbacks: user.awaitFeedbacks})
          ])
              .then(result => result[1]);
        }
        // Add skip count
        else {
          feedback.skipCount = ~~feedback.skipCount+1;
          feedback.updatedAt = timeStamp;
          //update user
          return updateUser(userId, {awaitFeedbacks: user.awaitFeedbacks});
        }
      });
};

module.exports = userAwaitFeedbackSkip;