'use strict';
const getAllRestaurants = require('./getAllRestaurants');
const getUser = require('./getUser');
const upsertUser = require('./upsertUser');
const addPromoToUser = require('./addPromoToUser');
const getCard = require('./getCard');
const stampCard = require('./stampCard');
const getAllCardEdges = require('./getAllCardEdges');

module.exports = {
  getAllRestaurants,
  getUser,
  upsertUser,
  addPromoToUser,
  getCard,
  stampCard,
  getAllCardEdges,
};