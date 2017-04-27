'use strict';
const _ = require('lodash');
const usersGetAll = require('../graphql/database').usersGetAll;
const stampEventsGetAll = require('../graphql/database').stampEventGetAll;
const stampEventUpdate = require('../graphql/database').stampEventUpdate;
const stampEventCreate = require('../graphql/database').stampEventCreate;

let allUsers = [];

const createStampEventsFromRedeemedCoupons = (event, context, callback) => {
  // updateExistingStampEvents
  let couponToRestaurant = {
    6950: {id: "dc499724-79d1-43ad-afac-5c006910af57", name: "Styo Dessert"},
    2949: {id: "3b0ca684-35e2-4e67-ac63-ddefeccbeec8", name:"Viet Sub Vietnamese Cuisine"},
    5992: {id: "cd29e901-23e3-4f6c-9359-5d7fc0d93187", name:"The Bubble Tea Shop - Richmond"},
    7842: {id: "c56f498e-a4b2-4eea-8694-b9038bf860fc", name:"India Gate"},
    8776: {id: "f2e0d429-7eac-4190-bae2-b2f54610a5e0", name:"No.1 Beef Noodle House"},
    6688: {id: "865654f0-b972-43ec-821a-f30dbb801faa", name:"Milk & Sugar"},
    4728: {id: "4939f8af-1696-487a-8426-c774566ca4fd", name:"Snowy Village - Coquitlam"},
    1289: {id: "61743236-8f07-408a-a53f-9baa5ee6eef0", name:"Red Burrito (Robson)"},
    1597: {id: "92b16601-9fe0-47cc-9fb7-03293bae23b0", name:"La Catrina"},
    6804: {id: "55ffdec9-2c44-4985-ac4f-6371a5c2f517", name:"Yeh! Frozen Yogurt & Cafe"},
    7388: {id: "96b7a021-383d-403d-ae62-81c360d2f549", name:"Snowy Village - Richmond"},
    5931: {id: "ede153aa-1879-4609-bdc9-11a467be2af2", name:"The Bubble Tea Shop - Vancouver"},
    6458: {id: "ea596b9d-da36-4737-aef5-0296f9297bc8", name:"Poke Bar"},
    4026: {id: "b970f6ac-1336-4508-b8ba-64b3981e0e0d", name:"Big Smoke Burger (SFU)"},
    5454: {id: "065a4293-daf5-4bfe-962c-927ba98fe319", name:"Russet Shack"},
    1828: {id: "c964fbf4-9329-4562-b041-1d1d428e0881", name:"Kosoo"},
    1048: {id: "6b8926eb-8e81-4c70-b75e-7f135e49cd4e", name:"Wicked Cafe"},
    9047: {id: "286e3ac8-bb41-4242-8309-fad3fa3937c6", name:"Snowy Village - Vancouver"},
    9438: {id: "bb93c76b-a55f-4594-8ca5-15a399fb1d5e", name:"Blossom Teas 櫻茶屋"},
    2587: {id: "a514fed9-d71b-4076-b743-ba1ff20a7f7c", name:"Starbucks"},
    "7eleven": {id: "c5ee3d67-b5c6-484a-8536-95651df629cb", name:"7 Eleven"},
  };
  
  let restaurantIdToCoupon = {};
  for (let key of Object.keys(couponToRestaurant)){
    let restaurant = couponToRestaurant[key];
    restaurantIdToCoupon[restaurant.id] = key;
  }
  
  Promise.all([
    stampEventsGetAll(),
    usersGetAll()
  ])
      .then(result => {
        const allStampEvents = result[0];
        allUsers = result[1];
        
        // calc idToUserMap
        const idToUserMap = {};
        for (let user of allUsers){
          idToUserMap[user.id] = user;
        }
        
        let modifyStampTablePromises = [];
        for (let stampEvent of allStampEvents){
          const {restaurantId, stampedAt, userId, isNewUser} = stampEvent;
          if (isNewUser){
            const restaurantCouponCode = restaurantIdToCoupon[restaurantId];
            const user = idToUserMap[userId];
            if (!user) continue;
            const userRedeemedCoupons = user.redeemedCoupons;
            if (!userRedeemedCoupons) continue;
            const userNotNew = !!_.find(userRedeemedCoupons, {couponCode: restaurantCouponCode});
  
            if (userNotNew) {
              console.log(`push change promise for restaurantId ${restaurantId}, stampedAt ${stampedAt}`);
              modifyStampTablePromises.push(
                  stampEventUpdate(restaurantId, stampedAt, {isNewUser: false})
              );
            }
          }
        }
        return Promise.all(modifyStampTablePromises);
      })
      .then((result) => {
        console.log(`${result.length} stampEvents are changed`);
        let createStampEventPromises = [];
        for (let user of allUsers){
          if (!user.redeemedCoupons) {
            continue;
          }
          for (let coupon of user.redeemedCoupons){
            let restaurant = coupon && coupon.couponCode && couponToRestaurant[coupon.couponCode];
            // If the coupon is not for all restaurant
            if (restaurant){
              const stampEvent = {
                restaurantId: restaurant.id,
                userId: user.id,
                fbName: user.fbName,
                restaurantName: restaurant.name,
                isNewUser: true,
                couponCode: coupon.couponCode,
                stampedAt: coupon.redeemedAt,
              };
              console.log("stampEvent to be created", JSON.stringify(stampEvent));
              createStampEventPromises.push(stampEventCreate(stampEvent));
            }
          }
        }
        
        return Promise.all(createStampEventPromises);
      })
      .then((result) => {
        console.log(`${result.length} stampEvents are created`);
        console.log("result", result);
        
        let response = {
          statusCode: 200,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({
            message: `${result.length} stampEvents are created`,
          }),
        };
      
        callback(null, response);
      })
      .catch(error => {
        console.log("error", error);
      });
};

module.exports = createStampEventsFromRedeemedCoupons;