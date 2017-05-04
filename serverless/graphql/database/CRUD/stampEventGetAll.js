'use strict';
const StampEventTable = require('../config').StampEventTable;
const getAll = require('./getAll');

const getAllStampEvents = () => {
  return getAll(StampEventTable, options);
};

module.exports = getAllStampEvents;