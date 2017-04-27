'use strict';
const StampEventTable = require('./config').StampEventTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const api = require('../api');

/**
 * Update StampEventTable whose restaurantId === `restaurantId` && stampedAt===`stampedAt`
 * the fields in `newFields` would be updated
 * */
const updateStampEvent = (restaurantId, stampedAt, newFields) => {
  if (!restaurantId || !stampedAt) {
    return Promise.reject(new Error("Update fail: StampEvent doesn't have restaurantId or stampedAt"));
  }
  
  if (!newFields || Object.keys(newFields).length === 0) {
    return Promise.reject(new Error("Update fail: newFields can't be empty"));
  }
  
  // Get update parameters
  const UpdateExpression = api.getUpdateExpression(newFields);
  const ExpressionAttributeNames = api.getExpressionAttributeNames(newFields);
  const ExpressionAttributeValues = api.getExpressionAttributeValues(newFields);
  
  let params = {
    TableName: StampEventTable,
    Key: {
      restaurantId: restaurantId,
      stampedAt: stampedAt,
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };
  
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error(`Unable to update stampEvents fields. ${JSON.stringify(newFields)}`,
            JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("StampEvent updated successfully");
        console.log("newFields", JSON.stringify(newFields));
        resolve(data.Attributes);
      }
    });
  });
};

module.exports = updateStampEvent;