'use strict';
const uuidV4 = require('uuid/v4');
const api = require('../api');
const restaurantUpdate = require('./CRUD/restaurantUpdate');
const restaurantGet = require('./CRUD/restaurantGet');

const addRestaurantSurveyQuestion = (args) => {
  console.log("addRestaurantSurveyQuestion start");
  const {restaurantId, question, askInRound = 1, type = "score", maxScore = 5, textPlaceholder = null} = args;
  
  return restaurantGet(restaurantId)
      .then(restaurant => {
        // Handle error
        if (!restaurant) {
          return Promise.reject(new Error("Failed to add questions: restaurant doesn't exist"));
        }
        if (!question || typeof question !== "string" || question.length === 0){
          return Promise.reject(new Error("Failed to add questions: invalid question"));
        }
        if (type !== "score" && type!=="text" && type!=="select") {
          return Promise.reject(new Error("Failed to add questions: invalid question type"));
        }

        // Add new question to `newFields`
        const timeStamp = api.getTimeInSec();
        let newQuestion = {
          id: uuidV4(),
          createdAt: timeStamp,
          updatedAt: timeStamp,
          isDeleted: false,
          question,
          askInRound,
          type,
          maxScore,
          textPlaceholder,
        };
        let newFields = {surveyQuestions: restaurant.surveyQuestions};
        if (!newFields.surveyQuestions) {
          newFields.surveyQuestions = [newQuestion]
        } else {
          newFields.surveyQuestions.push(newQuestion);
        }
        
        // update restaurant record
        return restaurantUpdate(restaurantId, newFields);
      })
};

module.exports = addRestaurantSurveyQuestion;