'use strict';
const FeedbackEventTable = require('../config').FeedbackEventTable;
const update = require('./update');

const updateFeedbackEvent = (restaurantId, createdAt, newFields, options = {}) => {
  return update(FeedbackEventTable, {restaurantId, createdAt}, newFields, options)
};

module.exports = updateFeedbackEvent;