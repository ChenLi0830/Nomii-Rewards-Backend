'use strict';
const StampEventTable = require('../config').StampEventTable;
const getAll = require('./getAll');

const getAllStampEvents = (options = {}) => {
  return getAll(StampEventTable, options);
};

module.exports = getAllStampEvents;