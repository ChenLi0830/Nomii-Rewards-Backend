'use strict';
const FeedbackTagTable = require('../config').FeedbackTagTable;
const uuidV4 = require('uuid/v4');
const create = require('./create');

const createStampEvent = (args) => {
  args.id = uuidV4();
  return create(FeedbackTagTable, args);
};

module.exports = createStampEvent;