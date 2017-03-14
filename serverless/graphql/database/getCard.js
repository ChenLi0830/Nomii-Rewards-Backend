'use strict';
const getAllRestaurants = require('./getAllRestaurants');
const _ = require('lodash');

const getCard = (cardId) => {
  const allCards = getAllRestaurants();
  return _.find(allCards, {id: cardId});
};

module.exports = getCard;