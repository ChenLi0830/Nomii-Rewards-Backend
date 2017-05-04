'use strict';
const StampEventTable = require('../config').StampEventTable;
const create = require('./create');
const api = require('../../api');

const createStampEvent = (args) => {
  const timeStamp = api.getTimeInSec();
  args.stampedAt = timeStamp;
  return create(StampEventTable, args);
};

module.exports = createStampEvent;