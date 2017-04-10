'use strict';

const _ = require('lodash');
const db = require('../database');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLBoolean = graphql.GraphQLBoolean,
    GraphQLID = graphql.GraphQLID,
    GraphQLList = graphql.GraphQLList;

const CouponType = new GraphQLObjectType({
  name: "Coupon",
  fields: () => ({
    code: {type: GraphQLString},
    isForAllRestaurants: {type: GraphQLBoolean},
    restaurantId: {type: GraphQLID},
    expireAt: {type: GraphQLInt},
    couponsLeft: {type: GraphQLInt},
    excludedRestaurants: {
      type: new GraphQLList(GraphQLID),
    },
    discounts: {
      type: new GraphQLList(GraphQLInt)
    },
    PINSuccessScreens: {
      type: new GraphQLList(GraphQLString),
    },
    codeSuccessScreen:{type: GraphQLString},
    type: {type: GraphQLString}
  }),
});

module.exports = CouponType;