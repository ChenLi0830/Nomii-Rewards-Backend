'use strict';
const restaurantsGetAll = require('./restaurantsGetAll');
const restaurantGet = require('./restaurantGet');
const restaurantCreate = require('./restaurantCreate');
const restaurantPINCreate = require('./restaurantPINCreate');
const restaurantPINUse = require('./restaurantPINUse');

const userGet = require('./userGet');
const userUpsert = require('./userUpsert');
const userRedeemCoupon = require('./userRedeemCoupon');
const userStampCard = require('./userStampCard');
const userCardGetAll = require('./userCardGetAll');

const couponCreate = require('./couponCreate');
const couponGet = require('./couponGet');
const couponGetAll = require('./couponGetAll');
const couponUse = require('./couponUse');

const stampEventCreate = require('./stampEventCreate');

module.exports = {
  restaurantsGetAll,
  restaurantCreate,
  restaurantGet,
  restaurantPINCreate,
  restaurantPINUse,
  userGet,
  userUpsert,
  userRedeemCoupon,
  userStampCard,
  userCardGetAll,
  couponCreate,
  couponGetAll,
  couponGet,
  couponUse,
};