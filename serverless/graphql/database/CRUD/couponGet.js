'use strict';
const CouponTable = require('../config').CouponTable;
const get = require('./get');

const getCoupon = (code) => {
  return get(CouponTable, {code});
};

module.exports = getCoupon;