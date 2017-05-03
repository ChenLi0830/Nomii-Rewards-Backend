'use strict';

const graphql = require('graphql'),
    GraphQLInputObjectType = graphql.GraphQLInputObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLID = graphql.GraphQLID;

const FeedbackTagType = new GraphQLInputObjectType({
  name: "FeedbackTagInput",
  fields: () => ({
    id: {type: GraphQLID},
    content: {type: GraphQLString},
  }),
});

module.exports = FeedbackTagType;