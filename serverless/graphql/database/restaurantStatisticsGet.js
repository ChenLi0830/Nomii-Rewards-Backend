"use strict";

const getStampEventDuringPeriod = require('./stampEventGetDuringPeriod');

const restaurantStatisticsGet = (restaurantId, daysToCoverList, endTo) => {
  console.log("restaurantStatisticsGet start");
  let promises = [];
  for (let daysToCover of daysToCoverList){
    promises.push(
        getStampEventDuringPeriod(restaurantId, daysToCover, endTo)
            .then(stampEvents => {
              let newUserSet = new Set();
              let returnUserSet = new Set();
              let newVisitCount = 0;
              let returnVisitCount = 0;
              let PINsCount = {};
              let couponsCount = 0;
          
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
          
              const statisticsResult = {
                restaurantId,
                newUserCount: newUserSet.size,
                returnUserCount: returnUserSet.size,
                newVisitCount,
                returnVisitCount,
                PINsCount: PINsCountArray,
                couponsCount,
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