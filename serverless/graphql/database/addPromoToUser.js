'use strict';

const getAllCards = require('./getAllCards');
const getUser = require('./getUser');

const getNewCardEdges = (user) => {
  let allCards = getAllCards();
  let userCardEdges = user.cards;
  let idEdgeMap = new Map();
  
  userCardEdges.forEach(card => {
    idEdgeMap.set(card.id, card);
  });
  
  allCards.forEach(card => {
    if (idEdgeMap.has(card.id)) {
      let oldEdge = idEdgeMap.get(card.id);
      oldEdge.stampCount++;
    } else {
      idEdgeMap.set(card.id, {
        id: card.id,
        stampCount: 1,
      });
    }
  });

  const cardEdges = Array.from(idEdgeMap.values());
  // console.log("cardEdges", cardEdges);
  return cardEdges;
};

const updateDB = (newCardEdges, userId) => {
  console.log("newCardEdges", newCardEdges);
  return fetch(`http://localhost:3000/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cards: newCardEdges,
    })
  })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
};

const addPromoToUser = (userId, code) => {
  console.log("addPromoToUser userId, code", userId, code);
  if (code === "code"){
    return getUser(userId)
        .then(user => {return getNewCardEdges(user)})
        .then(newCardEdges => {return updateDB(newCardEdges, userId)});
  } else {
    throw new Error('Invalid Code');
  }
};

module.exports = addPromoToUser;