'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const api = require('../api');

/**
 * Update user whose id === `userId`, the fields in `newFields` would be updated
 * */
const updateUser = (userId, newFields) => {
  // Check for argument errors
  if (!userId) {
    return Promise.reject(new Error("Update fail: user doesn't have id"));
  }
  if (!newFields || Object.keys(newFields).length === 0) {
    return Promise.reject(new Error("Update fail: newFields can't be empty"));
  }
  
  // Get update parameters
  const UpdateExpression = api.getUpdateExpression(newFields);
  const ExpressionAttributeNames = api.getExpressionAttributeNames(newFields);
  const ExpressionAttributeValues = api.getExpressionAttributeValues(newFields);
  
  let params = {
    TableName: UserTable,
    Key: {
      id: userId
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };
  
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error(`Unable to update user fields. ${JSON.stringify(newFields)}`,
            JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("User updated successfully");
        // console.log("newFields", JSON.stringify(newFields));
        resolve(data.Attributes);
      }
    });
  });
};

module.exports = updateUser;