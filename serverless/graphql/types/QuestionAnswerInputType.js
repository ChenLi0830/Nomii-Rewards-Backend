'use strict';

const graphql = require('graphql'),
    GraphQLInt = graphql.GraphQLInt,
    GraphQLString = graphql.GraphQLString,
    GraphQLInputObjectType = graphql.GraphQLInputObjectType,
    GraphQLID = graphql.GraphQLID;

const QuestionAnswerType = new GraphQLInputObjectType({
  name: "QuestionAnswerInput",
  fields: () => ({
    surveyQuestionId: {type: GraphQLID},
    score: {type: GraphQLInt},
    comment: {type: GraphQLString}, //optional
  }),
});

module.exports = QuestionAnswerType;