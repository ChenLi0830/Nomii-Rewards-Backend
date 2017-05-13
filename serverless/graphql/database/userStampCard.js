'use strict';
const _ = require('lodash');
const getUser = require('./CRUD/userGet');
const getRestaurant = require('./CRUD/restaurantGet');
const useRestaurantPIN = require('./restaurantPINUse');
const createStampEvent = require('./CRUD/stampEventCreate');
const userAwaitFeedbackAdd = require('./userAwaitFeedbackAdd');
const updateUser = require('./CRUD/userUpdate');
const api = require('../api');

const calcUserCards = (user, cardId, stampValidDays) => {
  // console.log("stampValidDays", stampValidDays);
  let cardIndex = _.findIndex(user.cards, {id: cardId});
  let card;
  let usedCard;

  //User doesn't have that card
  if (cardIndex < 0) {
    card = {id: cardId, stampCount: 1, lastStampAt: api.getTimeInSec()};
    user.cards.push(card);
  }
  // Card is expired
  else if (user.cards[cardIndex].lastStampAt + stampValidDays * 24 * 3600 < api.getTimeInSec()){
    user.cards[cardIndex].lastStampAt = api.getTimeInSec();
    user.cards[cardIndex].stampCount = 1;
  }
  // Card is used up
  else if (user.cards[cardIndex].stampCount >= 2) {
    usedCard = user.cards.slice(cardIndex, cardIndex+1);
    usedCard.stampCount++;
    user.cards[cardIndex] = {id: user.cards[cardIndex].id, stampCount:0, lastStampAt: undefined};
  }
  // Add stamp to card
  else {
    user.cards[cardIndex].stampCount++;
    // If the card is added by allResto coupon, update its lastStampAt attribute
    if (!user.cards[cardIndex].lastStampAt) user.cards[cardIndex].lastStampAt = api.getTimeInSec();
  }

  return Promise.resolve({newCards: user.cards, usedCard: usedCard});
};

const stampCard = (userId, cardId, PINCode) => {
  console.log("strampCard start userId, cardId, PINCode", userId, cardId, PINCode);
  return getRestaurant(cardId)
      .then(restaurant => {
        // Check PIN exist
        const PIN = _.find(restaurant.PINs, {code: PINCode});
        if (!PIN || !PIN.code) return Promise.reject(new Error('Invalid PIN'));

        return getUser(userId)
            .then(user => {
              return calcUserCards(user, cardId, restaurant.stampValidDays)
                  .then(result => {
                    let newCards = result.newCards;
                    let usedCard = result.usedCard;
                    if (!!usedCard) user.usedCards.push(usedCard);
                    let visitedRestaurants = user.visitedRestaurants;
                    const isNewUser = !api.userVisitedRestaurantBefore(user, cardId);
                    if (isNewUser) {
                      visitedRestaurants.push(cardId);
                    }
                    
                    const newCard = _.find(newCards, {id: cardId});
                    
                    const stampEvent = {
                      restaurantId: cardId,
                      userId,
                      restaurantName: restaurant.name,
                      isNewUser,
                      PIN: PINCode,
                      employeeName: PIN.employeeName,
                      userName: user.fbName,
                    };
                    
                    const awaitFeedback = {
                      userId,
                      restaurantId: cardId,
                      stampCountOfCard: newCard.stampCount,
                      employeeName: PIN.employeeName,
                      isNewUser,
                    };
                    
                    return userAwaitFeedbackAdd(awaitFeedback)
                        .then(result => {
                          return Promise.all([
                            updateUser(userId, {cards: newCards, visitedRestaurants, usedCards: user.usedCards}),
                            useRestaurantPIN(cardId, PINCode),
                            createStampEvent(stampEvent),
                          ])
                              .then(results => {
                                // console.log("results", results);
                                return results[0];
                              })
                        })
                  })
            })
            .catch(error => {
              console.log(error);
              throw error;
            })
      });
};

module.exports = stampCard;
