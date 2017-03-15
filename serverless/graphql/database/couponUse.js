'use strict';
const CouponTable = require('./config').CouponTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const api = require('../api');

/**
 * Decrease coupon atomically
 * */
const useCoupon = (coupon, number) => {
  if (typeof number !== "number") number = 1;
  
  //Check if coupon is unlimited
  console.log("coupon.couponsLeft", coupon.couponsLeft);
  if (coupon.couponsLeft === null) return coupon;
  
  let params = {
    TableName: CouponTable,
    Key: {code: coupon.code},
    UpdateExpression: "ADD couponsLeft :number",
    ExpressionAttributeValues: {
      ":number": -number,
    },
    ReturnValues: "ALL_NEW"
  };
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error("Unable to update the couponsLeft field for the coupon. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      const coupon = data.Attributes;
      // console.log("coupon",coupon);
      resolve(coupon);
    });
  });
};

module.exports = useCoupon;