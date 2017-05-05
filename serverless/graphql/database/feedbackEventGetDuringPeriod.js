'use strict';
const FeedbackEventTable = require('./config').FeedbackEventTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const getFeedbackEventDuringPeriod = (restaurantId, daysToCover, endTo) => {
  console.log("getFeedbackEventDuringPeriod start restaurantId, daysToCover, endTo", restaurantId, daysToCover, endTo);
  
  if (typeof endTo !== "number") endTo = api.getTimeInSec();
  let startFrom = endTo - daysToCover * 24 * 3600;
  
  const params = {
    TableName: FeedbackEventTable,
    KeyConditionExpression: 'restaurantId = :restaurantId and createdAt BETWEEN :startFrom and :endTo',
    ExpressionAttributeValues: {
      ":restaurantId": restaurantId,
      ":startFrom": startFrom,
      ":endTo": endTo,
    },
  };
  
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.error("Unable to get the feedbackEvents. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      let feedbackEvents = data.Items;
      resolve(feedbackEvents);
    });
  });
};

module.exports = getFeedbackEventDuringPeriod;