'use strict';
const UserTableName = require('./config').UserTableName;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();


const getUser = (userId) => {
  let params = {
    TableName: UserTableName,
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
  
  // return fetch(`http://localhost:3000/users/${userId}`)
  //     .then((response) => {
  //       if (response.status >= 400) {
  //         throw new Error("Bad response from server");
  //       }
  //       return response.json();
  //     });
};

module.exports = getUser;