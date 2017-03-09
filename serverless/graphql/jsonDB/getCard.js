'use strict';
const getAllCards = require('./getAllCards');
const _ = require('lodash');

const getCard = (cardId) => {
  const allCards = getAllCards();
  return _.find(allCards, {id: cardId});
};

module.exports = getCard;