'use strict';
const _ = require('lodash');
const feedbackEventGetAll = require('../graphql/database').feedbackEventGetAll;
const feedbackEventUpdate = require('../graphql/database').feedbackEventUpdate;
const userGet = require('../graphql/database').userGet;
const api = require('../graphql/api');
require('isomorphic-fetch');

let addURLToFeedbackPromises = [];

const addPictureURLToFeedbacks = (event, context, callback) => {
  feedbackEventGetAll()
      .then(allFeedbacks => {
        console.log("allFeedbacks has size", allFeedbacks.length);
        
        for (let feedback of allFeedbacks){
          addURLToFeedbackPromises.push(
              userGet(feedback.userId)
                  .then(user => {
                    feedbackEventUpdate(feedback.restaurantId, feedback.createdAt, {userPictureURL: user.pictureURL});
                  })
          );
        }
        
        return Promise.all(addURLToFeedbackPromises);
      })
      .then((result) => {
        console.log(`${result.length} users updated picture URL`);
        
        let response = {
          statusCode: 200,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({
            message: `${result.length} feedback events updated picture URL`,
          }),
        };
      
        callback(null, response);
      })
      .catch(error => {
        console.log("error", error);
      });
};

module.exports = addPictureURLToFeedbacks;