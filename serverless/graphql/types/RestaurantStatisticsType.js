'use strict';

const _ = require('lodash');
const db = require('../database');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLID = graphql.GraphQLID,
    GraphQLList = graphql.GraphQLList,
    GraphQLFloat = graphql.GraphQLFloat,
    GraphQLString = graphql.GraphQLString;

const PINCountType = new GraphQLObjectType({
  name: "PINCountType",
  fields: () => ({
    employeeName: {type: GraphQLString},
    count: {type: GraphQLInt},
  }),
});

const RestaurantStatisticsType = new GraphQLObjectType({
  name: "StatisticsOfRestaurant",
  fields: () => ({
    restaurantId: {type: GraphQLID}, // restaurant's id
    newUserCount: {type: GraphQLInt},
    returnUserCount: {type: GraphQLInt},
    newVisitCount: {type: GraphQLInt},
    returnVisitCount: {type: GraphQLInt},
    couponsCount: {type: GraphQLInt},
    averageRating: {type: GraphQLFloat},
    PINsCount: {type: new GraphQLList(PINCountType)},
  })
});

module.exports = RestaurantStatisticsType;