'use strict';
const CouponTable = require('./config').CouponTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');
const getCoupon = require('./couponGet');

const insertCoupon = (coupon) => {
  return new Promise((resolve, reject) => {
    let params = {
      TableName: CouponTable,
      Item: coupon,
      // ReturnConsumedCapacity: "TOTAL",
    };
    docClient.put(params, (err, data) => {
      if (err) {
        console.error("Unable to insert coupon. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log(`Coupon '${coupon.code}' inserted successfully`);
        resolve(coupon);
      }
    });
  })
  
};

const createCoupon = (code, isForAllRestaurants, restaurantId, daysToExpire, numberOfCoupons) => {
  // console.log("code", code);
  return getCoupon(code)
      .then(dupCoupon => {
        if (dupCoupon && dupCoupon.code) {
          // coupon exist
          if (!dupCoupon.expireAt || dupCoupon.expireAt > api.getTimeInSec()) {
            // coupon is not expired
            return Promise.reject(new Error("coupon with same code already exist"));
          }
        }
        
        if (daysToExpire < 0) daysToExpire = 365*10;
        if (numberOfCoupons < 0) numberOfCoupons = 1000000000;
          
        //Create coupon
        const coupon = {
          code,
          isForAllRestaurants,
          restaurantId,
          expireAt: api.getTimeInSec() + daysToExpire * 24 * 3600,
          couponsLeft: numberOfCoupons,
          createdAt: api.getTimeInSec(),
        };
        
        return insertCoupon(coupon);
      })
};

module.exports = createCoupon;