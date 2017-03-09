'use strict';
const getAllCards = require('./getAllCards');
const getUser = require('./getUser');
const upsertUser = require('./upsertUser');
const addPromoToUser = require('./addPromoToUser');
const getCard = require('./getCard');
const stampCard = require('./stampCard');
const getAllCardEdges = require('./getAllCardEdges');

module.exports = {
  getAllCards,
  getUser,
  upsertUser,
  addPromoToUser,
  getCard,
  stampCard,
  getAllCardEdges,
};