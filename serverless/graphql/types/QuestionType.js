'use strict';

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLBoolean = graphql.GraphQLBoolean,
    GraphQLList = graphql.GraphQLList,
    GraphQLID = graphql.GraphQLID;

const QuestionType = new GraphQLObjectType({
  name: "Question",
  fields: () => ({
    id: {type: GraphQLID},
    createdAt: {type: GraphQLInt},
    updatedAt: {type: GraphQLInt},
    question: {type: GraphQLString},
    askInRound: {type: GraphQLInt},
    isDeleted:{type: GraphQLBoolean},
    type: {type: GraphQLString},//(textInput, select, score),
    // *maxScore: int,
    // *textPlaceholder: string,
  }),
});

module.exports = QuestionType;