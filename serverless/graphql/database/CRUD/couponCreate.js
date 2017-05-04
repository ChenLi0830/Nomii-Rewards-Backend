'use strict';
const create = require('./create');
const CouponTable = require('../config').CouponTable;
const _ = require('lodash');
const api = require('../../api');
const getCoupon = require('./couponGet');

const createCoupon = (args) => {
  const timeStamp = api.getTimeInSec();
  
  return getCoupon(args.code)
  //Check for duplication
      .then(dupCoupon => {
        if (dupCoupon && dupCoupon.code) {
          // coupon exist
          if (!dupCoupon.expireAt || dupCoupon.expireAt > timeStamp) {
            // coupon is not expired
            return Promise.reject(new Error("coupon with same code already exist"));
          }
        }
  
        //Create coupon
        if (args.daysToExpire < 0) args.daysToExpire = 365*10;
        if (args.couponsLeft < 0) args.couponsLeft = 1000000000;
        args.expireAt = timeStamp + args.daysToExpire * 24 * 3600;
        
        return create(CouponTable, args);
      })
};

module.exports = createCoupon;