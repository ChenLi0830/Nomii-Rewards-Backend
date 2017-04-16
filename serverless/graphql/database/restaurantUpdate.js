'use strict';
const RestaurantTable = require('./config').RestaurantTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const api = require('../api');

const getUpdateExpression = (newFields) => {
  let UpdateExpression = "SET";
  for (let fieldKey of Object.keys(newFields)) {
    UpdateExpression += ` #${fieldKey} = :${fieldKey},`
  }
  //Return UpdateExpression after trimming the last character
  return UpdateExpression.slice(0, -1);
};

const getExpressionAttributeNames = (newFields) => {
  let ExpressionAttributeNames = {};
  for (let fieldKey of Object.keys(newFields)) {
    ExpressionAttributeNames[`#${fieldKey}`] = fieldKey;
  }
  return ExpressionAttributeNames;
};

const getExpressionAttributeValues = (newFields) => {
  let ExpressionAttributeValues = {};
  for (let fieldKey of Object.keys(newFields)) {
    ExpressionAttributeValues[`:${fieldKey}`] = newFields[fieldKey];
  }
  return ExpressionAttributeValues;
};

/**
 * Update restaurant whose id === `restaurantId`, the fields in `newFields` would be updated
 * */
const updateRestaurant = (restaurantId, newFields) => {
  if (!restaurantId) {
    return Promise.reject(new Error("Update fail: restaurant doesn't have id"));
  }
  
  if (!newFields || Object.keys(newFields).length === 0) {
    return Promise.reject(new Error("Update fail: newFields can't be empty"));
  }
  
  // Get update parameters
  const UpdateExpression = getUpdateExpression(newFields);
  const ExpressionAttributeNames = getExpressionAttributeNames(newFields);
  const ExpressionAttributeValues = getExpressionAttributeValues(newFields);
  
  let params = {
    TableName: RestaurantTable,
    Key: {
      id: restaurantId
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };
  
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error(`Unable to update restaurant fields. ${JSON.stringify(newFields)}`,
            JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("Restaurant updated successfully");
        console.log("newFields", JSON.stringify(newFields));
        resolve(data.Attributes);
      }
    });
  });
};

module.exports = updateRestaurant;