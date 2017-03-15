'use strict';
'use strict';
const UserTable = require('./config').UserTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const getAllRestaurants = require('./restaurantsGetAll');
const getUser = require('./userGet');
const getCoupon = require('./couponGet');
const useCoupon = require('./couponUse');
const api = require('../api');

const userRedeemedCouponBefore = (user, coupon) => {
  const usedCoupon = _.find(user.redeemedCoupons, {couponCode: coupon.code});
  console.log("used coupon", usedCoupon);
  return !!usedCoupon;
};

const userVisitedRestaurantBefore = (user, coupon) => {
  const visitedRestaurant = _.find(user.visitedRestaurants, function (id) {
    return id === coupon.restaurantId
  });
  console.log("visitedRestaurant", visitedRestaurant);
  return !!visitedRestaurant;
};

const calcCardsForAllRestaurants = (user) => {
  return getAllRestaurants()
      .then(allRestaurants => {
        let userCards = user.cards;
        let visitedRestaurants = user.visitedRestaurants;
        let idCardMap = new Map(); // Store new cards in this map
        
        // Create new cards for all restaurants
        allRestaurants.forEach(restaurant => {
          idCardMap.set(restaurant.id, {
            id: restaurant.id,
            stampCount: 1,
          });
        });
        
        // Remove the ones that the user has visited
        visitedRestaurants.forEach(restaurantId => {
          idCardMap.delete(restaurantId)
        });
        
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
  const restaurantVisited = _.find(user.visitedRestaurants, {restaurantsId: coupon.restaurantId});
  if (restaurantVisited) return Promise.reject(new Error("Coupon is only valid if you haven't" +
      " use the app in the restaurant before"));
  
  let idCardMap = new Map(); // Store new cards in this map
  
  // Add user's current cards
  user.cards.forEach(card => {
    idCardMap.set(card.id, card);
  });
  
  let newCard = {
    id: coupon.restaurantId,
    lastStampAt: api.getTimeInSec(),
    stampCount: 1
  };
  
  idCardMap.set(newCard.id, newCard);
  const cards = Array.from(idCardMap.values());
  return Promise.resolve(cards);
};

const updateUserTable = (cards, user, coupon) => {
  // console.log("cards", cards);
  // let visitedRestaurants = user.visitedRestaurants;
  // if (!coupon.isForAllRestaurants) visitedRestaurants.push(coupon.restaurantId);
  let redeemedCoupons = user.redeemedCoupons;
  redeemedCoupons.push({redeemedAt: api.getTimeInSec(), couponCode: coupon.code});
  
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
  // console.log("addPromoToUser userId, code", userId, code);
  return getCoupon(code)
      .then(coupon => {
        if (!coupon || !coupon.code) {
          return Promise.reject(new Error("Invalid Code"));
        }
        else if (coupon.expireAt && coupon.expireAt < api.getTimeInSec()) {
          return Promise.reject(new Error("Coupon Expired"));
        }
        else if (coupon.couponsLeft <= 0) {
          return Promise.reject(new Error("No coupon left"));
        }
        else {
          return getUser(userId)
              .then(user => {
                if (userRedeemedCouponBefore(user, coupon)) {
                  return Promise.reject(new Error("It seems you've redeemed this coupon before"));
                }
                
                // Redeem coupon for all restaurants
                if (coupon.isForAllRestaurants) {
                  return calcCardsForAllRestaurants(user)
                      .then(cards => {
                        console.log("cards", cards);
                        return Promise.all([updateUserTable(cards, user, coupon), useCoupon(coupon)])
                            .then(result => {
                              // console.log("result", result);
                              return result[0];//return new user
                            })
                      });
                }
                // Redeem coupon for one restaurant
                else {
                  if (userVisitedRestaurantBefore(user, coupon)) {
                    return Promise.reject(new Error("Sorry the coupon is only for new visitors to this restaurant"));
                  }
                  return calcCardForRestaurant(user, coupon)
                      .then(cards => {
                        console.log("cards", cards);
                        return Promise.all([updateUserTable(cards, user, coupon), useCoupon(coupon)])
                            .then(result => {
                              // console.log("result", result);
                              return result[0];//return new user
                            })
                      });

                }
              })
        }
      });
};

module.exports = userRedeemCoupon;