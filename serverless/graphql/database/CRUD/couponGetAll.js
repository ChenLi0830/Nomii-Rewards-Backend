'use strict';
const CouponTable = require('../config').CouponTable;
const getAll = require('./getAll');

const getAllCoupons = () => {
  return getAll(CouponTable);
};

module.exports = getAllCoupons;