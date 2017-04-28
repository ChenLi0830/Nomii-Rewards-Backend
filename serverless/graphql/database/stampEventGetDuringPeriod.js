'use strict';
const StampEventTable = require('./config').StampEventTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const getStampEventDuringPeriod = (restaurantId, daysToCover = 30, endTo = api.getTimeInSec()) => {
  console.log("restaurantId, daysToCover, endTo", restaurantId, daysToCover, endTo);
  
  // if (typeof endTo !== "number") endTo = api.getTimeInSec();
  let startFrom = endTo - daysToCover * 24 * 3600;
  
  const params = {
    TableName: StampEventTable,
    KeyConditionExpression: 'restaurantId = :restaurantId and stampedAt BETWEEN :startFrom and :endTo',
    ExpressionAttributeValues: {
      ":restaurantId": restaurantId,
      ":startFrom": startFrom,
      ":endTo": endTo,
    },
  };
  
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.error("Unable to get the stampEvents. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      // console.log("data", data);
      let stampEvents = data.Items;
      // console.log("stampEvents", stampEvents);
      // console.log("user", user);
      // if (!user) user = {};
      // console.log("Scan restaurants succeeded:", JSON.stringify(restaurants));
      resolve(stampEvents);
    });
  });
};

module.exports = getStampEventDuringPeriod;