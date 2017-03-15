'use strict';
const CouponTable = require('./config').CouponTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');

const getCoupon = (code) => {
  let params = {
    TableName: CouponTable,
    Key: {
      code: code
    },
  };
  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        console.error("Unable to get coupon. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      const coupon = data.Item;
      resolve(coupon);
    });
  });
};

module.exports = getCoupon;