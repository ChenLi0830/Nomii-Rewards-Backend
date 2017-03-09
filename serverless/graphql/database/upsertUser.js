'use strict';
const UserTableName = require('./config').UserTableName;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();

const getUserFromDB = (id)=>{
  let params = {
    TableName: UserTableName,
    Key: {
      id: id
    },
  };
  
  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        console.error("Unable to get item. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      let user = data.Item;
      console.log("user", user);
      if (!user) user = {};
      // console.log("GetItem succeeded:", JSON.stringify(item));
      resolve(user);
    });
  })
};

const insertUserToDB = (id, fbName) => {
  const user = {
    id,
    fbName,
    cards: [],
  };
  return new Promise((resolve, reject) => {
    let params = {
      TableName: UserTableName,
      Item: user,
    };
    docClient.put(params, (err, data) => {
      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("User added successfully");
        resolve(user);
      }
    });
  })
};

const upsertUser = (id, fbName) => {
  return getUserFromDB(id)
      .then(user => {
        // return user;
        if (user && user.id) return user;
        else return insertUserToDB(id, fbName);
      });
};

module.exports = upsertUser;