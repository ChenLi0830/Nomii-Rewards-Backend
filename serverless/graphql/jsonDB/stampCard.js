'use strict';
const _ = require('lodash');
const getUser = require('./getUser');

const getUserCards = (user, cardId) => {
  // console.log("user.cards", user.cards);
  // console.log("user.cards[0].id", typeof user.cards[0].id, "cardId", typeof cardId);
  // console.log(user.cards[0].id === cardId);
  
  let card = _.find(user.cards, {id: cardId});
  
  if (card === undefined){
    card = {id: cardId, stampCount: 0};
    user.cards.push(card);
  }
  
  card.stampCount++;
  card.lastStampAt = String(new Date().getTime());
  return user.cards;
};

const updateDB = (userId, newCards) => {
  console.log("newCards", newCards);
  return fetch(`http://localhost:3000/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cards: newCards,
    })
  })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
};

const stampCard = (userId, cardId, pin) => {
  // console.log("strampCard userId, cardId, pin", userId, cardId, pin);
  if (pin === "2587"){
    return getUser(userId)
        .then(user => {return getUserCards(user, cardId)})
        .then(newCards => {return updateDB(userId, newCards)})
  } else {
    throw new Error('Invalid PIN');
  }
};

module.exports = stampCard;