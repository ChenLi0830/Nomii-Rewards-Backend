"use strict";

const getStampEventDuringPeriod = require('./stampEventGetDuringPeriod');

const restaurantStatisticsGet = (restaurantId, daysToCover, endTo) => {
  return getStampEventDuringPeriod(restaurantId, daysToCover, endTo)
      .then(stampEvents => {
        let newUserSet = new Set();
        let returnUserSet = new Set();
        let newVisitCount = 0;
        let returnVisitCount = 0;
        
        stampEvents.forEach(stampEvent => {
          if (!stampEvent.isNewUser) {
            returnUserSet.add(stampEvent.userId);
            returnVisitCount++;
          } else {
            newUserSet.add(stampEvent.userId);
            newVisitCount++;
          }
        });
  
        const statisticsResult = {
          id: restaurantId,
          newUserCount: newUserSet.size,
          returnUserCount: returnUserSet.size,
          newVisitCount: newVisitCount,
          returnVisitCount: returnVisitCount,
        };
        
        console.log("statisticsResult", statisticsResult);
        return statisticsResult;
      })
};

module.exports = restaurantStatisticsGet;