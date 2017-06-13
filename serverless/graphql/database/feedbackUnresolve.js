'use strict';
const feedbackEventUpdate = require('./CRUD/feedbackEventUpdate');

const unresolveFeedback = (args) => {
  return feedbackEventUpdate(args.restaurantId, args.createdAt, {isResolved: false});
};

module.exports = unresolveFeedback;