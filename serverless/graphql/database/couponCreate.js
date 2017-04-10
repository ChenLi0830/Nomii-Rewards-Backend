'use strict';
const CouponTable = require('./config').CouponTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const api = require('../api');
const timeStamp = api.getTimeInSec();
const getCoupon = require('./couponGet');

const insertCoupon = (coupon) => {
  let params = {
    TableName: CouponTable,
    Item: coupon,
    // ReturnConsumedCapacity: "TOTAL",
  };
  
  return new Promise((resolve, reject) => {
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

const createCoupon = (code, isForAllRestaurants, restaurantId, daysToExpire, numberOfCoupons, excludedRestaurants, discounts, PINSuccessScreens, codeSuccessScreen, type) => {
  
  // console.log("code", code);
  return getCoupon(code)
      .then(dupCoupon => {
        if (dupCoupon && dupCoupon.code) {
          // coupon exist
          if (!dupCoupon.expireAt || dupCoupon.expireAt > timeStamp) {
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
          expireAt: timeStamp + daysToExpire * 24 * 3600,
          couponsLeft: numberOfCoupons,
          createdAt: timeStamp,
          excludedRestaurants,
          discounts,
          PINSuccessScreens,
          codeSuccessScreen,
          type,
        };
        
        return insertCoupon(coupon);
      })
};

module.exports = createCoupon;