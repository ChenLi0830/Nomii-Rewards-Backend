"use strict";

const getStampEventDuringPeriod = require('./stampEventGetDuringPeriod');
const feedbackEventGetDuringPeriod = require('./feedbackEventGetDuringPeriod');

const restaurantStatisticsGet = (restaurantId, daysToCoverList, endTo) => {
  console.log("restaurantStatisticsGet start");
  let promises = [];
  for (let daysToCover of daysToCoverList){
    promises.push(
        Promise.all([
          getStampEventDuringPeriod(restaurantId, daysToCover, endTo),
          feedbackEventGetDuringPeriod(restaurantId, daysToCover, endTo),
        ])
            .then(result => {
              let stampEvents = result[0];
              let feedbackEvents = result[1];
              let newUserSet = new Set();
              let returnUserSet = new Set();
              let newVisitCount = 0;
              let returnVisitCount = 0;
              let PINsCount = {};
              let couponsCount = 0;
              let ratingTotal = 0;
              let ratingCount = 0;
              
              // calc stats using stampEvents
              stampEvents.forEach(stampEvent => {
                if (!stampEvent.isNewUser) {
                  returnUserSet.add(stampEvent.userId);
                  returnVisitCount++;
                } else {
                  if (!newUserSet.has(stampEvent.userId)){
                    newUserSet.add(stampEvent.userId);
                    // user has visited in this restaurant before and somehow still has isNewUser===true
                  } else {
                    returnUserSet.add(stampEvent.userId);
                    returnVisitCount++;
                    console.log("stampEvent.userId is duplicated as new user", stampEvent.userId);
                  }
                  newVisitCount++;
                }
                if (stampEvent.employeeName){
                  PINsCount[stampEvent.employeeName] = ~~PINsCount[stampEvent.employeeName]+1;
                }
                if (stampEvent.couponCode){
                  couponsCount++;
                }
              });
          
              let PINsCountArray = Object.keys(PINsCount).map(employeeName => {
                return {
                  employeeName,
                  count: PINsCount[employeeName],
                }
              });
  
              // calc stats using feedbackEvents
              feedbackEvents.forEach(feedbackEvent => {
                if (feedbackEvent.rating > 0) {
                  ratingTotal += feedbackEvent.rating;
                  ratingCount += 1;
                }
              });
              
              const statisticsResult = {
                restaurantId,
                newUserCount: newUserSet.size,
                returnUserCount: returnUserSet.size,
                newVisitCount,
                returnVisitCount,
                couponsCount,
                averageRating: ratingCount > 0 ? ratingTotal / ratingCount : 0,
                PINsCount: PINsCountArray,
              };
          
              console.log("statisticsResult", statisticsResult);
              return statisticsResult;
            })
    );
  }
  
  return Promise.all(promises)
      .then(result => {
        console.log("result", result);
        return result;
      });
};

module.exports = restaurantStatisticsGet;