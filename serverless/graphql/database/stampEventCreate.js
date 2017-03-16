'use strict';
const StampEventTable = require('./config').StampEventTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const createStampEvent = (restaurantId, userId, restaurantName, isNewUser) => {
  const stampEvent = {
    restaurantId: restaurantId,
    StampedAt: api.getTimeInSec(),
    userId: userId,
    isNewUser: isNewUser,
    restaurantName: restaurantName,
  };
  
  let params = {
    TableName: StampEventTable,
    Item: stampEvent,
    ReturnConsumedCapacity: "NONE",
  };
  
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        console.error("Unable to insert stamp event. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("Stamp event inserted successfully");
        resolve(stampEvent);
      }
    });
  });
};

module.exports = createStampEvent;