'use strict';

let AWS = require("aws-sdk");
AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000",
  accessKeyId: "123",
  secretAccessKey: "345",
});

const UserTableName = "Nomii-Rewards-Users";

module.exports = {UserTableName, AWS};