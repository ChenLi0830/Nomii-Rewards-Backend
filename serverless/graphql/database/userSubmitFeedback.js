'use strict';
const getRestaurant = require('./CRUD/restaurantGet');
const getUser = require('./CRUD/userGet');
const feedbackEventCreate = require('./CRUD/feedbackEventCreate');
const userAwaitFeedbackDelete = require('./userAwaitFeedbackDelete');
const removeInvalidArgs = require('../api').removeInvalidArgs;
const userSubmitFeedback = (args) => {
  args = removeInvalidArgs(args);
  return Promise.all([
    getRestaurant(args.restaurantId),
    getUser(args.userId),
  ])
      .then(result => {
        return Promise.all([
          feedbackEventCreate({
            restaurantName: result[0].name,
            userName: result[1].fbName,
            restaurantId: args.restaurantId,
            userId: args.userId,
            userVisitedRestaurantAt: args.userVisitedRestaurantAt,
            stampCountOfCard: args.stampCountOfCard,
            employeeName: args.employeeName,
            rating: args.rating,
            tags: args.tags,
            comment: args.comment,
            userContact: args.userContact,
            userContactName: args.userContactName,
          }),
          userAwaitFeedbackDelete({
            userId: args.userId,
            restaurantId: args.restaurantId,
            visitedAt: args.userVisitedRestaurantAt,
          }),
        ])
            .then(result => {
              return result[0];
            })
      });
};

module.exports = userSubmitFeedback;