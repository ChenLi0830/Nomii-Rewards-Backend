'use strict';

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLList = graphql.GraphQLList,
    GraphQLID = graphql.GraphQLID;

const QuestionAnswerType = new GraphQLObjectType({
  surveyQuestionId: {type: GraphQLID},
  score: {type: GraphQLInt},
  // comment: {type: GraphQLString}, //optional
});

const FeedBackType = new GraphQLObjectType({
  name: "Feedback",
  fields: () => ({
    restaurantId: {type: GraphQLString},
    createdAt: {type: GraphQLInt},
    userId: {type: GraphQLID},
    questions: {type: new GraphQLList(QuestionAnswerType)},
    tags: {type: new GraphQLList(GraphQLID)},
    comment: {type: GraphQLString},
    userContact: {type: GraphQLString},
  }),
});

module.exports = FeedBackType;