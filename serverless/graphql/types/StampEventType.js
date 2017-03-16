'use strict';

const _ = require('lodash');
const db = require('../database');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLBoolean = graphql.GraphQLBoolean,
    GraphQLID = graphql.GraphQLID;

const StampEventType = new GraphQLObjectType({
  name: "StampEvent",
  fields: () => ({
    restaurantId: {type: GraphQLString},
    stampedAt: {type: GraphQLInt},
    userId: {type: GraphQLID},
    isNewUser: {type: GraphQLBoolean},
    restaurantName: {type: GraphQLString},
    PIN: {type: GraphQLString},
    employeeName: {type: GraphQLString},
    userName: {type: GraphQLString},
  }),
});

module.exports = StampEventType;