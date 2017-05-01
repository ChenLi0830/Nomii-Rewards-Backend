'use strict';
const FeedbackTagTable = require('./config').FeedbackTagTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');
const uuidV4 = require('uuid/v4');

const createStampEvent = ({content}) => {
  const timeStamp = api.getTimeInSec();
  const newFeedbackTag = {
    id: uuidV4(),
    createdAt: timeStamp,
    updatedAt: timeStamp,
    content,
  };
  
  let params = {
    TableName: FeedbackTagTable,
    Item: newFeedbackTag,
    // ReturnConsumedCapacity: "TOTAL",
    // ReturnValues: "UPDATED_NEW",
  };
  
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        console.error("Unable to insert feedback tag. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("Feedback tag inserted successfully");
        resolve(newFeedbackTag);
      }
    });
  });
};

module.exports = createStampEvent;