'use strict';

/**
 * Get the edges of all cards for a specific user
 * */
const getAllRestaurants = require('./CRUD/restaurantsGetAll');
const getUser = require('./CRUD/userGet');

const getAllCards = (userId) => {
  console.log("getAllCards start");
  return getAllRestaurants()
      .then(allRestaurants => {
  
        // console.log("allCards", allCards);
  
        let allCards = allRestaurants.map(card => {
          return {id: card.id, stampCount: 0, card: card}
        });
  
        // console.log("allCards", allCards);
  
        let allCardsMap = new Map();
        allCards.forEach(card => {
          allCardsMap.set(card.id, card);
        });
  
        // console.log("allCardsMap", allCardsMap);
  
        return getUser(userId)
            .then(user => {
              let userCards = user.cards;
              // console.log("userCardEdges", userCardEdges);
  
              userCards.forEach(userCard => {
                allCardsMap.set(userCard.id, userCard);
              });
        
              let result = Array.from(allCardsMap.values());
              // console.log("result", result);
              return result;
            })
      });
};
  
  
module.exports = getAllCards;