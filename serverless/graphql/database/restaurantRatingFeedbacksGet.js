"use strict";

const feedbackEventGetDuringPeriod = require('./feedbackEventGetDuringPeriod');

const restaurantRatingFeedbacksGet = (restaurantId, daysToCover, endTo) => {
  return feedbackEventGetDuringPeriod(restaurantId, daysToCover, endTo)
      .then(feedbackEvents => {
        return feedbackEvents.filter(feedback => feedback.rating > 0)
      })
};

module.exports = restaurantRatingFeedbacksGet;