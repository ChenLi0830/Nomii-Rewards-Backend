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
    id: {type: GraphQLID},
    stampCount: {type: GraphQLInt},
    lastStampAt: {type: GraphQLInt},
    restaurant: {
      type: RestaurantType,
      resolve(parentValue){
        return db.getCard(parentValue.id);
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
    PINS: {
      type: new GraphQLList(PINType),
      resolve(parentValue, args){
        // return db.getRestaurantPin(parentValue.id),
      },
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
    // users: {
    //   type: new GraphQLList(UserType),
    //   resolve: () => {
    //     return fetch(`http://localhost:3000/users`)
    //         .then((response) => {
    //           if (response.status >= 400) {
    //             throw new Error("Bad response from server");
    //           }
    //           return response.json();
    //         });
    //   }
    // },
    // userCardEdges: {
    //   type: new GraphQLList(UserCardEdge),
    //   args: {userId: {type: GraphQLID}},
    //   resolve: (parentValue, args) => {
    //     return db.getUserCards(args.userId);
    //   }
    // },
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
        pin: {type: GraphQLString}
      },
      resolve: (parentValue, args) => {
        return db.stampCard(args.userId, args.cardId, args.pin);
      },
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});