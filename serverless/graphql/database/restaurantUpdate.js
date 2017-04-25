'use strict';
const RestaurantTable = require('./config').RestaurantTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const api = require('../api');

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
  const UpdateExpression = api.getUpdateExpression(newFields);
  const ExpressionAttributeNames = api.getExpressionAttributeNames(newFields);
  const ExpressionAttributeValues = api.getExpressionAttributeValues(newFields);
  
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