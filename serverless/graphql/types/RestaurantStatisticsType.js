'use strict';

const _ = require('lodash');
const db = require('../database');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLID = graphql.GraphQLID;

const RestaurantStatisticsType = new GraphQLObjectType({
  name: "StatisticsOfRestaurant",
  fields: () => ({
    id: {type: GraphQLID}, // restaurant's id
    newUserCount: {type: GraphQLInt},
    returnUserCount: {type: GraphQLInt},
    newVisitCount: {type: GraphQLInt},
    returnVisitCount: {type: GraphQLInt},
  })
});

module.exports = RestaurantStatisticsType;