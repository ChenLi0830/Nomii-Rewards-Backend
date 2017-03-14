'use strict';
const CouponTable = require('./config').CouponTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Get the edges of all cards for a specific user
 * */
const getAllCoupons = () => {
  const params = {
    TableName: CouponTable,
  };
  
  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to get all coupons. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      let coupons = data.Items;
      // console.log("user", user);
      // if (!user) user = {};
      console.log("Scan coupons succeeded:", JSON.stringify(coupons));
      resolve(coupons);
    });
  });
};

module.exports = getAllCoupons;
