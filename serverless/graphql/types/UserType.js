'use strict';

const _ = require('lodash');
const db = require('../database');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLList = graphql.GraphQLList,
    GraphQLNonNull = graphql.GraphQLNonNull,
    GraphQLBoolean = graphql.GraphQLBoolean,
    GraphQLID = graphql.GraphQLID;

const CardType = require('./CardType');
const RedeemedCouponType = require('./RedeemedCouponType');
const RestaurantType = require('./RestaurantType');
const FeedBackTagType = require('./FeedBackTagType');

const AwaitFeedbackType = new GraphQLObjectType({
  name: "AwaitFeedback",
  fields: () => ({
    restaurantId: {type : GraphQLID},
    visitedAt: {type : GraphQLInt},
    stampCountOfCard: {type : GraphQLInt},
    employeeName: {type : GraphQLString},
    skipCount: {type: GraphQLInt},
    isNewUser: {type: GraphQLBoolean},
    restaurant: {
      type: RestaurantType,
      resolve(parentValue){
        return db.restaurantGet(parentValue.restaurantId);
      },
    },
    feedbackTags: {
      type: new GraphQLList(FeedBackTagType),
      resolve(parentValue){
        return db.feedbackTagGetAll();
      }
    }
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {type: GraphQLID},
    fbName: {type: GraphQLString},
    registeredAt: {type: GraphQLInt},
    lastLoginAt: {type: GraphQLInt},
    isNomiiAdmin: {type: GraphQLBoolean},
    pushTokens: {
      type: new GraphQLList(GraphQLString)
    },
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
    visitedRestaurants: {
      type: new GraphQLList(GraphQLID),
    },
    ownedRestaurants: {
      type: new GraphQLList(GraphQLID),
    },
    leavedFeedbackCount: {type: GraphQLInt},
    awaitFeedbacks: {
      type: new GraphQLList(AwaitFeedbackType)
    }
  })
});


module.exports = UserType;