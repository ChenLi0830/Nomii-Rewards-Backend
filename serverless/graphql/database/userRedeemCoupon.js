'use strict';
const _ = require('lodash');
const getAllRestaurants = require('./CRUD/restaurantsGetAll');
const getRestaurant = require('./CRUD/restaurantGet');
const getUser = require('./CRUD/userGet');
const getCoupon = require('./CRUD/couponGet');
const useCoupon = require('./couponUse');
const api = require('../api');
const createStampEvent = require('./CRUD/stampEventCreate');
const updateUser = require('./CRUD/userUpdate');
const userAwaitFeedbackAdd = require('./userAwaitFeedbackAdd');

const userRedeemedCouponBefore = (user, coupon) => {
  const usedCoupon = _.find(user.redeemedCoupons, {couponCode: coupon.code});
  console.log("used coupon", usedCoupon);
  return !!usedCoupon;
};

const calcCardsForAllRestaurants = (user, coupon) => {
  return getAllRestaurants()
      .then(allRestaurants => {
        let userCards = user.cards;
        let visitedRestaurants = user.visitedRestaurants;
        let excludedRestaurants = coupon.excludedRestaurants;
        let idCardMap = new Map(); // Store new cards in this map
  
        // Create new cards for all restaurants
        allRestaurants.forEach(restaurant => {
          idCardMap.set(restaurant.id, {
            id: restaurant.id,
            // add extra stamp if the coupon type is stamp or undefined
            stampCount: coupon.type === "discount" ? 0 : 1,
            discounts: coupon.discounts || [],
            PINSuccessScreens: coupon.PINSuccessScreens || [],
            codeSuccessScreen: coupon.codeSuccessScreen,
          });
        });

        // Remove the ones that the user has visited
        visitedRestaurants.forEach(restaurantId => {
          idCardMap.delete(restaurantId)
        });
        
        // Remove the ones that are excluded
        if (excludedRestaurants && excludedRestaurants.length > 0){
          for (let restaurantId of excludedRestaurants){
            idCardMap.delete(restaurantId);
          }
        }

        // console.log("userCards", userCards);
        // Add user's current cards back
        userCards.forEach(card => {
          idCardMap.set(card.id, card);
        });

        const cards = Array.from(idCardMap.values());
        
        // console.log("cards", cards);
        return cards;
      });
};

const calcCardForRestaurant = (user, coupon) => {
  let idCardMap = new Map(); // Store new cards in this map

  // Add user's current cards
  user.cards.forEach(card => {
    idCardMap.set(card.id, card);
  });

  let newCard = {
    id: coupon.restaurantId,
    lastStampAt: api.getTimeInSec(),
    stampCount: 1,
    discounts: coupon.discounts || [],
    PINSuccessScreens: coupon.PINSuccessScreens || [],
    codeSuccessScreen: coupon.codeSuccessScreen,
  };

  idCardMap.set(newCard.id, newCard);
  const cards = Array.from(idCardMap.values());
  return Promise.resolve(cards);
};

const userRedeemCoupon = (userId, code) => {
  console.log("userRedeemCoupon start userId, code", userId, code);
  return getCoupon(code)
      .then(coupon => {
        if (!coupon || !coupon.code) {
          return Promise.reject(new Error("Invalid Code"));
        } else if (coupon.expireAt && coupon.expireAt < api.getTimeInSec()) {
          return Promise.reject(new Error("Coupon Expired"));
        } else if (coupon.couponsLeft <= 0) {
          return Promise.reject(new Error("Coupon Limit Reached"));
        } else {
          return getUser(userId)
              .then(user => {
                if (userRedeemedCouponBefore(user, coupon)) {
                  return Promise.reject(new Error("Code Already Used"));
                }

                // Redeem coupon for all restaurants
                if (coupon.isForAllRestaurants) {
                  return calcCardsForAllRestaurants(user, coupon)
                      .then(cards => {
                        if (cards.length === 0) {
                          return Promise.reject(new Error("New restaurants visitors only"));
                        }
                        // calculate new fields for updating userTable
                        let redeemedCoupons = user.redeemedCoupons;
                        let newCoupon = {redeemedAt: api.getTimeInSec(), couponCode: coupon.code};
                        redeemedCoupons.push(newCoupon);
                        let newFields = {cards, redeemedCoupons};
                        
                        return Promise.all([
                          updateUser(userId, newFields),
                          useCoupon(coupon)
                        ])
                            .then(result => {
                              // console.log("result", result);
                              return result[0];//return new user
                            })
                      });
                }
                // Redeem coupon for one restaurant
                else {
                  if (api.userVisitedRestaurantBefore(user, coupon.restaurantId)) {
                    return Promise.reject(new Error("New restaurant visitors only"));
                  }
                  // User hasn't visit this restaurant before
                  return getRestaurant(coupon.restaurantId)
                      .then(restaurant => {
                        return calcCardForRestaurant(user, coupon)
                            .then(cards => {
                              // Calculate new fields for updating userTable
                              let redeemedCoupons = user.redeemedCoupons;
                              let newCoupon = {
                                redeemedAt: api.getTimeInSec(),
                                couponCode: coupon.code,
                                restaurantName: restaurant.name,
                              };
                              redeemedCoupons.push(newCoupon);
                              let visitedRestaurants = user.visitedRestaurants;
                              visitedRestaurants.push(coupon.restaurantId);
                              let newFields = {cards, redeemedCoupons, visitedRestaurants};
                              
                              // Calc new stampEvent record
                              const stampEvent = {
                                restaurantId: coupon.restaurantId,
                                userId,
                                userName: user.fbName,
                                restaurantName: restaurant.name,
                                isNewUser: true,
                                couponCode: code,
                              };
  
                              const awaitFeedback = {
                                userId,
                                restaurantId: coupon.restaurantId,
                                stampCountOfCard: 1,
                                isNewUser: true,
                                couponCode: code,
                              };
  
                              return userAwaitFeedbackAdd(awaitFeedback)
                                  .then(result => {
                                    return Promise.all([
                                      updateUser(userId, newFields),
                                      useCoupon(coupon),
                                      createStampEvent(stampEvent),
                                    ])
                                        .then(results => {
                                          // console.log("results", results);
                                          return results[0];
                                        })
                                  })
                              
                              
                            });
                      })
                }
              })
        }
      });
};

module.exports = userRedeemCoupon;
