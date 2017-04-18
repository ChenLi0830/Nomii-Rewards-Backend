'use strict';
const getRestaurant = require('./restaurantGet');
const getUser = require('./userGet');
const feedbackEventCreate = require('./feedbackEventCreate');

const userSubmitFeedback = (args) => {
  return Promise.all([
    getRestaurant(args.restaurantId),
    getUser(args.userId),
  ])
      .then(result => {
        return feedbackEventCreate({
          restaurantName: result[0].name,
          userName: result[1].fbName,
          restaurantId: args.restaurantId,
          userId: args.userId,
          questions: args.questions,
          tags: args.tags,
          comment: args.comment,
          userContact: args.userContact,
        })
      });
};

module.exports = userSubmitFeedback;