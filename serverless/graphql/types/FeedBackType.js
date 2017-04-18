'use strict';

const QuestionAnswerType = require('./QuestionAnswerType');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLList = graphql.GraphQLList,
    GraphQLID = graphql.GraphQLID;

const FeedBackType = new GraphQLObjectType({
  name: "Feedback",
  fields: () => ({
    restaurantId: {type: GraphQLID},
    restaurantName: {type: GraphQLString},
    userId: {type: GraphQLID},
    userName: {type: GraphQLString},
    createdAt: {type: GraphQLInt},
    questions: {type: new GraphQLList(QuestionAnswerType)},
    tags: {type: new GraphQLList(GraphQLID)},
    comment: {type: GraphQLString},
    userContact: {type: GraphQLString},
  }),
});

module.exports = FeedBackType;