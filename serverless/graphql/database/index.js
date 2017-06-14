'use strict';
const restaurantsGetAll = require('./CRUD/restaurantsGetAll');
const restaurantGet = require('./CRUD/restaurantGet');
const restaurantCreate = require('./CRUD/restaurantCreate');
const restaurantPINCreate = require('./restaurantPINCreate');
const restaurantPINEdit = require('./restaurantPINEdit');
const restaurantPINUse = require('./restaurantPINUse');
const restaurantPINRemove = require('./restaurantPINRemove');
const restaurantStatisticsGet = require('./restaurantStatisticsGet');
const restaurantQuestionAdd = require('./restaurantQuestionAdd');
const restaurantVisitStatisticsGet = require('./restaurantVisitStatisticsGet');
const restaurantRatingFeedbacksGet = require('./restaurantRatingFeedbacksGet');

const userGet = require('./CRUD/userGet');
const usersGetAll = require('./CRUD/usersGetAll');
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
const userAwaitFeedbackSkip = require('./userAwaitFeedbackSkip');

const couponCreate = require('./CRUD/couponCreate');
const couponGet = require('./CRUD/couponGet');
const couponGetAll = require('./CRUD/couponGetAll');
const couponUse = require('./couponUse');

const stampEventGetDuringPeriod = require('./stampEventGetDuringPeriod');
const stampEventGetAll = require('./CRUD/stampEventGetAll');
const stampEventUpdate = require('./CRUD/stampEventUpdate');
const stampEventCreate = require('./CRUD/stampEventCreate');

const feedbackTagCreate = require('./CRUD/feedbackTagCreate');
const feedbackTagGetAll = require('./CRUD/feedbackTagGetAll');

const feedbackEventGetAll = require('./CRUD/feedbackEventGetAll');
const feedbackEventUpdate = require('./CRUD/feedbackEventUpdate');
const feedbackResolve = require('./feedbackResolve');
const feedbackUnresolve = require('./feedbackUnresolve');

module.exports = {
  restaurantsGetAll,
  restaurantCreate,
  restaurantGet,
  restaurantPINCreate,
  restaurantPINEdit,
  restaurantPINUse,
  restaurantPINRemove,
  restaurantStatisticsGet,
  restaurantQuestionAdd,
  restaurantVisitStatisticsGet,
  restaurantRatingFeedbacksGet,
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
  userAwaitFeedbackSkip,
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
  feedbackEventGetAll,
  feedbackEventUpdate,
  feedbackResolve,
  feedbackUnresolve,
};