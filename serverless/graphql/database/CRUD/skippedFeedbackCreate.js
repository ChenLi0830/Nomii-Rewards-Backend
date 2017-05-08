const create = require('./create');
const SkippedFeedbackTable = require('../config').SkippedFeedbackTable;

const createSkippedFeedback = (args) => {
  return create(SkippedFeedbackTable, args);
};

module.exports = createSkippedFeedback;