'use strict';

let AWS = require("aws-sdk");

/**
 * For testing on local DynamoDB
 **/
console.log("process.env.DEBUG_MODE", process.env.DEBUG_MODE);
if (process.env.DEBUG_MODE) {
  AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000",
    accessKeyId: "123",
    secretAccessKey: "345",
  });
}

const UserTable = "Nomii-Rewards-Users";
const RestaurantTable = "Nomii-Rewards-Restaurants";
const CouponTable = "Nomii-Rewards-Coupons";
const StampEventTable = "Nomii-Rewards-Stamp-Events";
const FeedbackEventTable = "Nomii-Rewards-Feedback-Events";
const FeedbackTagTable = "Nomii-Rewards-Feedback-Tags";
const SkippedFeedbackTable = "Nomii-Rewards-Skipped-Feedbacks";

module.exports = {
  UserTable,
  RestaurantTable,
  CouponTable,
  StampEventTable,
  FeedbackEventTable,
  FeedbackTagTable,
  SkippedFeedbackTable,
  AWS
};