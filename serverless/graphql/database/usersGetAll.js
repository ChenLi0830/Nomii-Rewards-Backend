'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Get all users in the UserTable
 * @param {Object} options - The options for the scan method.
 * */
const getAllUsers = (options) => {
  let ExpressionAttributeNames,
      newProjectionExpression;
  
  if (options){
    const {projectionExpression} = options;
    if (projectionExpression){
      ExpressionAttributeNames = {};
      for (let attributeName of projectionExpression.replace(/ /g,'').split(',')){
        ExpressionAttributeNames[`#${attributeName}`] = attributeName;
      }
      newProjectionExpression = Object.keys(ExpressionAttributeNames).join(',');
    }
  }
  
  let params = {
    TableName: UserTable,
    ProjectionExpression: newProjectionExpression,
    ExpressionAttributeNames,
    // Limit: 2,
  };
  
  return new Promise((resolve, reject) => {
    let result = [];
    
    const onScan = (err, data) => {
      if (err) {
        console.error("Unable to get all users. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      console.log("Object.keys(data)", Object.keys(data));
      console.log(`${data.Items.length} items fetched`);
      
      result = result.concat(data.Items);
  
      // If there is more to scan, then scan again
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      } else {
        resolve(result);
      }
    };
    
    docClient.scan(params, onScan);
  });
};


module.exports = getAllUsers;