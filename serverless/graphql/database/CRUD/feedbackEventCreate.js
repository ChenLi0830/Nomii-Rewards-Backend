const create = require('../general/create');
const FeedbackEventTable = require('../config').FeedbackEventTable;

const createFeedbackEvent = (args) => {
  return create(FeedbackEventTable, args);
};

module.exports = createFeedbackEvent;