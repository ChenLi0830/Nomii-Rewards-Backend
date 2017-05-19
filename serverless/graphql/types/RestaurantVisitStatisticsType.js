'use strict';

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLID = graphql.GraphQLID,
    GraphQLList = graphql.GraphQLList,
    GraphQLFloat = graphql.GraphQLFloat;

const RestaurantVisitStatisticsType = new GraphQLObjectType({
  name: "VisitStatisticsOfRestaurant",
  fields: () => ({
    restaurantId: {type: GraphQLID}, // restaurant's id
    actualVisit: {type: GraphQLInt},
    withoutNomiiVisit: {type: GraphQLFloat},
  })
});

module.exports = RestaurantVisitStatisticsType;