'use strict';
const restaurantsGetAll = require('./restaurantsGetAll');
const restaurantGet = require('./restaurantGet');
const restaurantCreate = require('./CRUD/restaurantCreate');
const restaurantPINCreate = require('./restaurantPINCreate');
const restaurantPINUse = require('./restaurantPINUse');
const restaurantPINRemove = require('./restaurantPINRemove');
const restaurantStatisticsGet = require('./restaurantStatisticsGet');
const restaurantQuestionAdd = require('./restaurantQuestionAdd');

const userGet = require('./userGet');
const usersGetAll = require('./usersGetAll');
const userUpsert = require('./userUpsert');
const userRedeemCoupon = require('./userRedeemCoupon');
const userStampCard = require('./userStampCard');
const userCardGetAll = require('./userCardGetAll');
const userRestaurantOwnershipAdd = require('./userRestaurantOwnershipAdd');
const userRestaurantOwnershipRemove = require('./userRestaurantOwnershipRemove');
const userPushTokenAdd = require('./userPushTokenAdd');
const userSubmitFeedback = require('./userSubmitFeedback');
const userNomiiAdminSet = require('./userNomiiAdminSet');
const userAwaitFeedbackAdd = require('./userAwaitFeedbackAdd');

const couponCreate = require('./CRUD/couponCreate');
const couponGet = require('./couponGet');
const couponGetAll = require('./couponGetAll');
const couponUse = require('./couponUse');

const stampEventGetDuringPeriod = require('./stampEventGetDuringPeriod');
const stampEventGetAll = require('./stampEventGetAll');
const stampEventUpdate = require('./stampEventUpdate');
const stampEventCreate = require('./CRUD/stampEventCreate');

const feedbackTagCreate = require('./CRUD/feedbackTagCreate');
const feedbackTagGetAll = require('./feedbackTagGetAll');

module.exports = {
  restaurantsGetAll,
  restaurantCreate,
  restaurantGet,
  restaurantPINCreate,
  restaurantPINUse,
  restaurantPINRemove,
  restaurantStatisticsGet,
  restaurantQuestionAdd,
  userGet,
  userUpsert,
  userRedeemCoupon,
  userStampCard,
  userCardGetAll,
  userRestaurantOwnershipAdd,
  userRestaurantOwnershipRemove,
  userPushTokenAdd,
  usersGetAll,
  userSubmitFeedback,
  userAwaitFeedbackAdd,
  userNomiiAdminSet,
  couponCreate,
  couponGetAll,
  couponGet,
  couponUse,
  stampEventGetDuringPeriod,
  stampEventCreate,
  stampEventGetAll,
  stampEventUpdate,
  feedbackTagCreate,
  feedbackTagGetAll,
};