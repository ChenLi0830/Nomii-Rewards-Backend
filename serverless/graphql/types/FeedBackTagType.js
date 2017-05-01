'use strict';

const QuestionAnswerType = require('./QuestionAnswerType');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLID = graphql.GraphQLID;

const FeedbackTagType = new GraphQLObjectType({
  name: "FeedbackTag",
  fields: () => ({
    id: {type: GraphQLID},
    content: {type: GraphQLString},
    updatedAt: {type: GraphQLInt},
    createdAt: {type: GraphQLInt},
  }),
});

module.exports = FeedbackTagType;