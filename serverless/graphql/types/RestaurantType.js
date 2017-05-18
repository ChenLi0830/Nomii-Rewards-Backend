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
const QuestionType = require('./QuestionType');

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
    stampValidDays: {type: GraphQLInt},
    // openingHours: {type: GraphQLString},
    PINs: {
      type: new GraphQLList(PINType),
    },
    surveyQuestions: {
      type: new GraphQLList(QuestionType),
    },
    statistics: {
      type: new GraphQLList(RestaurantStatisticsType),
      args: {
        daysToCoverList: {type: new GraphQLList(GraphQLFloat)},
        endTo: {type: GraphQLInt},
      },
      resolve(parentValue, args){
        return db.restaurantStatisticsGet(parentValue.id, args.daysToCoverList, args.endTo)
      }
    },
  }),
});

module.exports = RestaurantType;