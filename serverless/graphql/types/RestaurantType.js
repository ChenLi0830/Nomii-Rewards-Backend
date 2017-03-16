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
    },
    newUserCount: {
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

module.exports = RestaurantType;