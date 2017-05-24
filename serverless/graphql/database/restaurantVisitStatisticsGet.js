"use strict";

const getStampEventDuringPeriod = require('./stampEventGetDuringPeriod');
const getFeedbackEventDuringPeriod = require('./feedbackEventGetDuringPeriod');
const api = require('../api');

const getDaysOf = (timePeriod) => {
  switch(timePeriod) {
    case "Week": return 7;
    case "Month": return 30;
    case "Year": return 365;
    default: throw new Error("Invalid timePeriod", timePeriod);
  }
};

const restaurantVisitStatisticsGet = (restaurantId, daysToCover, endTo = api.getTimeInSec()) => {
  console.log("restaurantStatisticsGet start");
  
  return Promise.all([
    getStampEventDuringPeriod(restaurantId, daysToCover, endTo),
    getFeedbackEventDuringPeriod(restaurantId, daysToCover, endTo),
  ])
      .then(result => {
        const stampEvents = result[0];
        const feedbackEvents = result[1];
      
        let stampEventUserSet = new Set();
        let returnFeedbackUser = 0;
        let fisrtTimeFeedbackUser = 0;
      
        let actualVisit = stampEvents.length;
        let withoutNomiiVisit = 0;
      
        //Get how many users visited this restaurant
        stampEvents.forEach(stampEvent => {
          stampEventUserSet.add(stampEvent.userId);
        });
      
        //Get how many visits would the restaurant get from users who filled visitFrequencyFeedback
        
        feedbackEvents.forEach(feedbackEvent => {
          if (feedbackEvent.isFirstTime) {
            fisrtTimeFeedbackUser++;
            withoutNomiiVisit++;
          }
          
          if (feedbackEvent.rating === 0 && !feedbackEvent.isFirstTime){
            returnFeedbackUser++;
            withoutNomiiVisit += (daysToCover / getDaysOf(feedbackEvent.timePeriod)) * feedbackEvent.visitTimes;
          }
        });
      
        // Estimate how many visits would the restaurant get from all the users in stampEventUserSet
        withoutNomiiVisit = withoutNomiiVisit * (stampEventUserSet.size / (fisrtTimeFeedbackUser+returnFeedbackUser));
      
        const statisticsResult = {
          restaurantId,
          actualVisit,
          withoutNomiiVisit,
        };
      
        console.log("statisticsResult", statisticsResult);
        return statisticsResult;
      });
};

module.exports = restaurantVisitStatisticsGet;