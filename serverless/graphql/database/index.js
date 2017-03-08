'use strict';
const getAllCards = require('./getAllCards');
const getUserCards = require('./getUserCards');
const getUser = require('./getUser');
const upsertUser = require('./upsertUser');
const addPromoToUser = require('./addPromoToUser');
const getCard = require('./getCard');
const stampCard = require('./stampCard');

module.exports = {
  getAllCards,
  getUserCards,
  getUser,
  upsertUser,
  addPromoToUser,
  getCard,
  stampCard,
};