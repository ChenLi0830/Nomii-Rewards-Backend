'use strict';
const restaurantsGetAll = require('./restaurantsGetAll');
const restaurantGet = require('./restaurantGet');
const restaurantCreate = require('./restaurantCreate');
const restaurantPINCreate = require('./restaurantPINCreate');
const restaurantPINUse = require('./restaurantPINUse');
const restaurantPINRemove = require('./restaurantPINRemove');
const restaurantStatisticsGet = require('./restaurantStatisticsGet');

const userGet = require('./userGet');
const usersGetAll = require('./usersGetAll');
const userUpsert = require('./userUpsert');
const userRedeemCoupon = require('./userRedeemCoupon');
const userStampCard = require('./userStampCard');
const userCardGetAll = require('./userCardGetAll');
const userRestaurantOwnershipAdd = require('./userRestaurantOwnershipAdd');
const userRestaurantOwnershipRemove = require('./userRestaurantOwnershipRemove');
const userPushTokenAdd = require('./userPushTokenAdd');

const couponCreate = require('./couponCreate');
const couponGet = require('./couponGet');
const couponGetAll = require('./couponGetAll');
const couponUse = require('./couponUse');

const stampEventGetDuringPeriod = require('./stampEventGetDuringPeriod');

module.exports = {
  restaurantsGetAll,
  restaurantCreate,
  restaurantGet,
  restaurantPINCreate,
  restaurantPINUse,
  restaurantPINRemove,
  restaurantStatisticsGet,
  userGet,
  userUpsert,
  userRedeemCoupon,
  userStampCard,
  userCardGetAll,
  userRestaurantOwnershipAdd,
  userRestaurantOwnershipRemove,
  userPushTokenAdd,
  usersGetAll,
  couponCreate,
  couponGetAll,
  couponGet,
  couponUse,
  stampEventGetDuringPeriod,
};