'use strict';
const feedbackEventUpdate = require('./CRUD/feedbackEventUpdate');

const resolveFeedback = (args) => {
  return feedbackEventUpdate(args.restaurantId, args.createdAt, {isResolved: true});
};

module.exports = resolveFeedback;