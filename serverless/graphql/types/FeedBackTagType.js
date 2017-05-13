'use strict';

const QuestionAnswerType = require('./QuestionAnswerType');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLFloat = graphql.GraphQLFloat,
    GraphQLID = graphql.GraphQLID;

const FeedbackTagType = new GraphQLObjectType({
  name: "FeedbackTag",
  fields: () => ({
    id: {type: GraphQLID},
    content: {type: GraphQLString},
    order: {type: GraphQLFloat},
    updatedAt: {type: GraphQLInt},
    createdAt: {type: GraphQLInt},
  }),
});

module.exports = FeedbackTagType;