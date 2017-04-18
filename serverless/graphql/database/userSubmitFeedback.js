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
          ...args,
          restaurantName: result[0].name,
          userName: result[1].fbName,
        })
      });
};

module.exports = userSubmitFeedback;