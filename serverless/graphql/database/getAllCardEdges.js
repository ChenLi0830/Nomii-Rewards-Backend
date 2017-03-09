'use strict';

/**
 * Get the edges of all cards for a specific user
 * */
const getAllCards = require('./getAllCards');
const getUser = require('./getUser');

const getAllCardEdges = (userId) => {
  console.log("userId", userId);
  
  const allCards = getAllCards();
  
  // console.log("allCards", allCards);
  
  let allEdges = allCards.map(card => {
    return {id: card.id, stampCount: 0, card: card}
  });
  
  // console.log("allEdges", allEdges);
  
  let allEdgesMap = new Map();
  allEdges.forEach(edge => {
    allEdgesMap.set(edge.id, edge);
  });
  
  // console.log("allEdgesMap", allEdgesMap);
  
  return getUser(userId)
      .then(user => {
        let userCardEdges = user.cards;
        // console.log("userCardEdges", userCardEdges);
        
        userCardEdges.forEach(userCardEdge => {
          allEdgesMap.set(userCardEdge.id, userCardEdge);
        });

        let result = Array.from(allEdgesMap.values());
        // console.log("result", result);
        return result;
      })
};
  
  
module.exports = getAllCardEdges;