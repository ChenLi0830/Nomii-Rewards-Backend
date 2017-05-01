'use strict';

const QuestionAnswerType = require('./QuestionAnswerType');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLFloat = graphql.GraphQLFloat,
    GraphQLList = graphql.GraphQLList,
    GraphQLID = graphql.GraphQLID;

const FeedBackType = new GraphQLObjectType({
  name: "Feedback",
  fields: () => ({
    restaurantId: {type: GraphQLID},
    restaurantName: {type: GraphQLString},
    userId: {type: GraphQLID},
    userName: {type: GraphQLString},
    userVisitedRestaurantAt: {type: GraphQLInt},
    stampDiscount: {type: GraphQLInt},
    employeeName: {type: GraphQLString},
    rating: {type: GraphQLFloat},
    createdAt: {type: GraphQLInt},
    updatedAt: {type: GraphQLInt},
    //questions: {type: new GraphQLList(QuestionAnswerType)},
    tags: {type: new GraphQLList(GraphQLID)},
    comment: {type: GraphQLString},
    userContact: {type: GraphQLString},
  }),
});

module.exports = FeedBackType;