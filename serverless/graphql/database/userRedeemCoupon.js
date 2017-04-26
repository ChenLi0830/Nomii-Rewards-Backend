'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const getAllRestaurants = require('./restaurantsGetAll');
const getRestaurant = require('./restaurantGet');
const userVisitedRestaurantBefore = require('./userVisitedRestaurantBeforeCheck');
const getUser = require('./userGet');
const getCoupon = require('./couponGet');
const useCoupon = require('./couponUse');
const api = require('../api');
const createStampEvent = require('./stampEventCreate');

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

const updateUserTable = (cards, user, coupon, restaurant) => {

  // Create new coupon and add to user.redeemedCoupons
  let redeemedCoupons = user.redeemedCoupons;
  let newCoupon = {redeemedAt: api.getTimeInSec(), couponCode: coupon.code};
  if (restaurant) newCoupon.restaurantName = restaurant.name;
  redeemedCoupons.push(newCoupon);

  return new Promise((resolve, reject) => {
    let params = {
      TableName: UserTable,
      Key: {id: user.id},
      UpdateExpression: "SET cards = :cards, redeemedCoupons = :redeemedCoupons",
      ExpressionAttributeValues: {
        ":cards": cards,
        ":redeemedCoupons": redeemedCoupons,
      },
      ReturnValues: "ALL_NEW"
    };
    docClient.update(params, (err, data) => {
      if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      } else {
        console.log("Item Updated successfully");
        // console.log("data", data);
        resolve(data.Attributes);
      }
    });
  });
};

const userRedeemCoupon = (userId, code) => {
  console.log("User redeem Coupon userId, code", userId, code);
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
                        // console.log("cards", cards);
                        return Promise.all([updateUserTable(cards, user, coupon), useCoupon(coupon)])
                            .then(result => {
                              // console.log("result", result);
                              return result[0];//return new user
                            })
                      });
                }
                // Redeem coupon for one restaurant
                else {
                  if (userVisitedRestaurantBefore(user, coupon.restaurantId)) {
                    return Promise.reject(new Error("New restaurant visitors only"));
                  }
                  return getRestaurant(coupon.restaurantId)
                      .then(restaurant => {
                        return calcCardForRestaurant(user, coupon)
                            .then(cards => {
                              // console.log("cards", cards);
                              const stampEvent = {
                                restaurantId: coupon.restaurantId,
                                userId,
                                fbName: user.fbName,
                                restaurantName: restaurant.name,
                                isNewUser: true,
                                couponCode: code,
                              };
                              
                              return Promise.all([
                                updateUserTable(cards, user, coupon, restaurant),
                                useCoupon(coupon),
                                createStampEvent(stampEvent),
                              ])
                                  .then(result => {
                                    // console.log("result", result);
                                    return result[0];//return new user
                                  })
                            });
                      })
                }
              })
        }
      });
};

module.exports = userRedeemCoupon;
