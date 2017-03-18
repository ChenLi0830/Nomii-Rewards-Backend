'use strict';

const _ = require('lodash');
const db = require('../database');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLList = graphql.GraphQLList,
    GraphQLNonNull = graphql.GraphQLNonNull,
    GraphQLFloat = graphql.GraphQLFloat,
    GraphQLID = graphql.GraphQLID;

const PINType = require('./PINType');
const RestaurantStatisticsType = require('./RestaurantStatisticsType');

const RestaurantType = new GraphQLObjectType({
  name: "Restaurant",
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    imageURL: {type: GraphQLString},
    longitude: {type: GraphQLFloat},
    latitude: {type: GraphQLFloat},
    description: {type: GraphQLString},
    address: {type: GraphQLString},
    // openingHours: {type: GraphQLString},
    PINs: {
      type: new GraphQLList(PINType),
    },
    statistics: {
      type: RestaurantStatisticsType,
      args: {
        daysToCover: {type: GraphQLFloat},
        endTo: {type: GraphQLInt},
      },
      resolve(parentValue, args){
        return db.restaurantStatisticsGet(parentValue.id, args.daysToCover, args.endTo)
      }
    },
  }),
});

module.exports = RestaurantType;