'use strict';
const CouponTable = require('../config').CouponTable;
const getAll = require('./getAll');

const getAllCoupons = (options = {}) => {
  return getAll(CouponTable, options);
};

module.exports = getAllCoupons;