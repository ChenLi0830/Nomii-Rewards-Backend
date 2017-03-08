'use strict';
const getAllCards = require('./getAllCards');
const _ = require('lodash');

const getUserCards = (userId) => {
  const cardContentList = getAllCards();
  
  return fetch(`http://localhost:3000/users/${userId}`)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(user => {
        var cardEdges = user.cards.map(cardEdge => {
              // console.log(cardEdge.id);
              // console.log(_.find(cardContentList, {id: cardEdge.id}));
              return Object.assign({}, cardEdge, {card: _.find(cardContentList, {id: cardEdge.id})})
            }
        );
        // console.log("cardEdges", cardEdges);
        return cardEdges;
      })
};

module.exports = getUserCards;