'use strict';

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLString = graphql.GraphQLString,
    GraphQLID = graphql.GraphQLID;

const QuestionAnswerType = new GraphQLObjectType({
  surveyQuestionId: {type: GraphQLID},
  score: {type: GraphQLInt},
  comment: {type: GraphQLString}, //optional
});

module.exports = QuestionAnswerType;