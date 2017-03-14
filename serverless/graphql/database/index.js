'use strict';
const getAllRestaurants = require('./getAllRestaurants');
const getUser = require('./getUser');
const upsertUser = require('./upsertUser');
const addPromoToUser = require('./addPromoToUser');
const getRestaurant = require('./getRestaurant');
const stampCard = require('./stampCard');
const getAllCardEdges = require('./getAllCardEdges');

module.exports = {
  getAllRestaurants,
  getUser,
  upsertUser,
  addPromoToUser,
  getRestaurant,
  stampCard,
  getAllCardEdges,
};