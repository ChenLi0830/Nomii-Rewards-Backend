'use strict';
const StampEventTable = require('../config').StampEventTable;
const update = require('./update');

/**
 * Update StampEventTable whose restaurantId === `restaurantId` && stampedAt===`stampedAt`
 * the fields in `newFields` would be updated
 * */
const updateStampEvent = (restaurantId, stampedAt, newFields, options = {}) => {
  return update(StampEventTable, {restaurantId, stampedAt}, newFields, options)
};

module.exports = updateStampEvent;