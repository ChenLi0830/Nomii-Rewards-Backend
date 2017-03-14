'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();


const getUser = (userId) => {
  let params = {
    TableName: UserTable,
    Key: {
      id: userId
    },
  };
  
  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        console.error("Unable to get item. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      let user = data.Item;
      // console.log("user", user);
      if (!user) user = {};
      // console.log("GetItem succeeded:", JSON.stringify(item));
      resolve(user);
    });
  });
};

module.exports = getUser;