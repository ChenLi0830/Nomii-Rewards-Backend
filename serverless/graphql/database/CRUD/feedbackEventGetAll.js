'use strict';
const FeedbackEventTable = require('../config').FeedbackEventTable;
const getAll = require('./getAll');

const getAllFeedbackEvents = (options = {}) => {
  return getAll(FeedbackEventTable, options);
};

module.exports = getAllFeedbackEvents;