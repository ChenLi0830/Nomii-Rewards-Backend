'use strict';

let AWS = require("aws-sdk");

/**
 * For testing on local DynamoDB
**/
AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000",
  accessKeyId: "123",
  secretAccessKey: "345",
});

const UserTable = "Nomii-Rewards-Users";

module.exports = {UserTable, AWS};