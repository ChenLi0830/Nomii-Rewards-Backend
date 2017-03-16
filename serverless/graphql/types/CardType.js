'use strict';

const _ = require('lodash');
const db = require('../database');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLID = graphql.GraphQLID;

const RestaurantType = require('./RestaurantType');

const CardType = new GraphQLObjectType({
  name: "Card",
  fields: () => ({
    id: {type: GraphQLID}, //the id here is the same as the restaurant's id
    stampCount: {type: GraphQLInt},
    lastStampAt: {type: GraphQLInt},
    restaurant: {
      type: RestaurantType,
      resolve(parentValue){
        return db.restaurantGet(parentValue.id);
      },
    },
  })
});

module.exports = CardType;