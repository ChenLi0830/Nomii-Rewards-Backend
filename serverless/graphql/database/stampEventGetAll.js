'use strict';
const StampEventTable = require('./config').StampEventTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Get all stampEvents in the StampEventTable
 * */
const getAllStampEvents = () => {
  const params = {
    TableName: StampEventTable,
  };
  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to get all stampEvents. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      resolve(data.Items);
    });
  });
};

module.exports = getAllStampEvents;