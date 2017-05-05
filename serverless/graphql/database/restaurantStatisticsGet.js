"use strict";

const getStampEventDuringPeriod = require('./stampEventGetDuringPeriod');

const restaurantStatisticsGet = (restaurantId, daysToCover, endTo) => {
  console.log("restaurantStatisticsGet start");
  return getStampEventDuringPeriod(restaurantId, daysToCover, endTo)
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
            newUserSet.add(stampEvent.userId);
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
          id: restaurantId,
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
};

module.exports = restaurantStatisticsGet;