const create = require('./create');
const FeedbackEventTable = require('../config').FeedbackEventTable;

const createFeedbackEvent = (args) => {
  return create(FeedbackEventTable, args);
};

module.exports = createFeedbackEvent;