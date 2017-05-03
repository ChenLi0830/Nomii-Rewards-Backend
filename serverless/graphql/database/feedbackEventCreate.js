'use strict';
const FeedbackEventTable = require('./config').FeedbackEventTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const createFeedbackEvent = (args) => {
  const {
      restaurantId,
      userId,
      comment,
      userContact,
      userContactName,
      tags = [],
      restaurantName,
      userName,
      userVisitedRestaurantAt,
      stampCountOfCard,
      rating,
      employeeName
  } = args;
  
  const feedbackEvent = {
    restaurantId,
    restaurantName,
    userId,
    userName,
    userVisitedRestaurantAt,
    stampCountOfCard,
    rating,
    employeeName,
    createdAt: api.getTimeInSec(),
    comment,
    userContact,
    userContactName,
    tags,
  };
  
  let params = {
    TableName: FeedbackEventTable,
    Item: feedbackEvent,
    ReturnConsumedCapacity: "NONE",
  };
  
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        console.error("Unable to insert feedback event. Error JSON:", JSON.stringify(err),
            err.stack);
        return reject(err);
      } else {
        console.log("feedback event inserted successfully");
        resolve(feedbackEvent);
      }
    });
  });
};

module.exports = createFeedbackEvent;