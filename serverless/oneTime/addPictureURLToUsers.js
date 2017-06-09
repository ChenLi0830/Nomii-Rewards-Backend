'use strict';
const _ = require('lodash');
const usersGetAll = require('../graphql/database/index').usersGetAll;
const updateUser = require('../graphql/database/CRUD/userUpdate');
const api = require('../graphql/api');
require('isomorphic-fetch');

let addURLToUserPromises = [];

const addPictureURLToUsers = (event, context, callback) => {
  usersGetAll()
      .then(allUsers => {
        console.log("allUsers has size", allUsers.length);
        
        for (let user of allUsers){
          addURLToUserPromises.push(
              api.getUserPhotoURL(user.id)
                  .then(pictureURL => {
                    if (pictureURL) updateUser(user.id, {pictureURL});
                  })
          );
        }
        
        return Promise.all(addURLToUserPromises);
      })
      .then((result) => {
        console.log(`${result.length} users updated picture URL`);
        
        let response = {
          statusCode: 200,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({
            message: `${result.length} users updated picture URL`,
          }),
        };
      
        callback(null, response);
      })
      .catch(error => {
        console.log("error", error);
      });
};

module.exports = addPictureURLToUsers;