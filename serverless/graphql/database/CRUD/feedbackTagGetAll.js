'use strict';
const FeedbackTagTable = require('../config').FeedbackTagTable;
const getAll = require('./getAll');

const getAllFeedbackTags = (options = {}) => {
  return getAll(FeedbackTagTable, options);
};

module.exports = getAllFeedbackTags;