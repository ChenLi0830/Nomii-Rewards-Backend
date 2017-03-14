'use strict';
// require('es6-promise').polyfill();
require('isomorphic-fetch');

const _ = require('lodash');
const db = require('./database');
const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLSchema = graphql.GraphQLSchema,
    GraphQLList = graphql.GraphQLList,
    GraphQLNonNull = graphql.GraphQLNonNull,
    GraphQLFloat = graphql.GraphQLFloat,
    GraphQLBoolean = graphql.GraphQLBoolean,
    GraphQLID = graphql.GraphQLID;

const PINType = new GraphQLObjectType({
  name: "PIN",
  fields: () => ({
    code: {type: GraphQLString},
    employeeName: {type: GraphQLString},
    numberOfUse: {type: GraphQLInt},
  }),
});

const CardType = new GraphQLObjectType({
  name: "Card",
  fields: () => ({
    id: {type: GraphQLID}, //the id here is the same as the restaurant's id
    stampCount: {type: GraphQLInt},
    lastStampAt: {type: GraphQLInt},
    restaurant: {
      type: RestaurantType,
      resolve(parentValue){
        return db.getRestaurant(parentValue.id);
      },
    },
  })
});

const RestaurantType = new GraphQLObjectType({
  name: "Restaurant",
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    imageURL: {type: GraphQLString},
    longitude: {type: GraphQLFloat},
    latitude: {type: GraphQLFloat},
    description: {type: GraphQLString},
    PINs: {
      type: new GraphQLList(PINType),
      resolve(parentValue, args){
        // return db.getRestaurantPin(parentValue.id),
      },
    },
    newUserCount:{
      type: GraphQLInt,
      args: {
        restaurantId: {type: GraphQLID},
        startFrom: {type: GraphQLInt},
        endTo: {type: GraphQLInt},
      },
      resolve(parentValue, args){
        // return db.getRestaurantNewUserCount(args.restaurantId, args.startFrom, args.endTo)
      }
    },
    returnUserCount: {
      type: GraphQLInt,
      args: {
        restaurantId: {type: GraphQLID},
        startFrom: {type: GraphQLInt},
        endTo: {type: GraphQLInt},
      },
      resolve(parentValue, args){
        // return db.getRestaurantReturnUserCount(args.restaurantId, args.startFrom, args.endTo)
      }
    },
    newVisitCount: {
      type: GraphQLInt,
      args: {
        restaurantId: {type: GraphQLID},
        startFrom: {type: GraphQLInt},
        endTo: {type: GraphQLInt},
      },
      resolve(parentValue, args){
        // return db.getRestaurantNewVisitCount(args.restaurantId, args.startFrom, args.endTo)
      }
    },
    returnVisitCount: {
      type: GraphQLInt,
      args: {
        restaurantId: {type: GraphQLID},
        startFrom: {type: GraphQLInt},
        endTo: {type: GraphQLInt},
      },
      resolve(parentValue, args){
        // return db.getRestaurantReturnVisitCount(args.restaurantId, args.startFrom, args.endTo)
      }
    },
    
  }),
});

const RedeemedCouponType = new GraphQLObjectType({
  name: "redeemedCoupon",
  fields: () => ({
    redeemedAt: {type: GraphQLInt},
    couponCode: {type: GraphQLString},
    coupon: {
      type: CouponType,
      resolve(parentValue, args){
        //return db.getCoupon(parentValue.couponCode);
      },
    }
  }),
});

const CouponType = new GraphQLObjectType({
  name: "Coupon",
  fields: () => ({
    code: {type: GraphQLString},
    isForAllRestaurants: {type: GraphQLBoolean},
    restaurantId: {type: GraphQLID},
    expireAt: {type: GraphQLInt},
    couponsLeft: {type: GraphQLInt},
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {type: GraphQLID},
    fbName: {type: GraphQLString},
    registeredAt: {type: GraphQLInt},
    lastLoginAt: {type: GraphQLInt},
    cards: {
      type: new GraphQLList(CardType),
    },
    usedCards: {
      type: new GraphQLList(CardType),
    },
    redeemedCoupons: {
      type: new GraphQLList(RedeemedCouponType),
      // resolve(parentValue, args){
      //   // return
      // },
    },
    visitedRestaurants:{
      type: new GraphQLList(GraphQLID),
    },
    ownedRestaurants: {
      type: new GraphQLList(GraphQLID),
    }
  })
});


const StampEventsType = new GraphQLObjectType({
  name: "StampEvents",
  fields: () => ({
    restaurantId: {type: GraphQLString},
    stampedAt: {type: GraphQLInt},
    userId: {type: GraphQLID},
    isNewUser: {type: GraphQLBoolean},
    restaurantName: {type: GraphQLString},
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve: (parentValue, args) => {
        return db.getUser(args.id);
      },
    },
    allRestaurantCards: {
      type: new GraphQLList(CardType),
      args: {userId: {type: GraphQLID}},
      resolve: (parentValue, args) => {
        return db.getAllCardEdges(args.userId);
      }
    },
    coupons: {
      type: new GraphQLList(CouponType),
      resolve: (parentValue, args) => {
        // return db.getAllCoupons();
      }
    },
    restaurant: {
      type: RestaurantType,
      args: {id: {type: GraphQLID}},
      resolve: (parentValue, args) => {
        return db.getRestaurant(args.id);
      }
    },
    stampEvents: {
      type: new GraphQLList(StampEventsType),
      args: {
        startFrom: {type: GraphQLInt},
        endTo: {type: GraphQLInt},
      },
      resolve: (parentValue, args) => {
        // return db.getStampEvents(args.startFrom, args.endTo);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    upsertUser: {//Update or insert user when one log in from facebook
      type: UserType,
      args: {
        id: {type: GraphQLID},
        fbName: {type: GraphQLString},
      },
      resolve: (parentValue, args)=>{
        return db.upsertUser(args.id, args.fbName);
      }
    },
    redeemPromo: { // Redeem the promo code for a user, and add an additional stamp for all theuser's cards
      type: UserType,
      args: {
        userId: {type: GraphQLID},
        code: {type: GraphQLString}
      },
      resolve: (parentValue, args)=>{
        return db.addPromoToUser(args.userId, args.code);
      }
    },
    stampCard: { // Stamp a card for a user
      type: UserType,
      args: {
        userId: {type: GraphQLID},
        cardId: {type: GraphQLID},
        PIN: {type: GraphQLString}
      },
      resolve: (parentValue, args) => {
        return db.stampCard(args.userId, args.cardId, args.PIN);
      },
    },
    createPIN: {
      type: PINType,
      args: {
        restaurantId: {type: GraphQLID},
        PIN: {type: GraphQLString},
        employeeName: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        // return db.createPIN(args.restaurantId, args.PIN, args.employeeName);
      }
    },
    createCoupon: {
      type: CouponType,
      args: {
        isForAllRestaurants: {type: GraphQLBoolean},
        restaurantId: {type: GraphQLID},
        expireAt: {type: GraphQLInt},
        numberOfCoupons: {type: GraphQLInt},
      },
      resolve: (parentValue, args) => {
        // return db.createCoupon(args.isForAllRestaurants, args.restaurantId, args.expireAt,
        // args.numberOfCoupons )
      }
    },
    createRestaurant:{
      type: RestaurantType,
      args: {
        name: {type: GraphQLString},
        imageURL: {type: GraphQLString},
        longitude: {type: GraphQLFloat},
        latitude: {type: GraphQLFloat},
        description: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.createRestaurant(args.name, args.imageURL, args.longitude, args.latitude, args.description);
      }
    },
    
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});