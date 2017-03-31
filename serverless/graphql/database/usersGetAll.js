'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Get all users in the UserTable
 * */
const getAllUsers = () => {
  const params = {
    TableName: UserTable,
  };
  
  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to get all users. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      let users = data.Items;
      resolve(users);
    });
  });
};


module.exports = getAllUsers;