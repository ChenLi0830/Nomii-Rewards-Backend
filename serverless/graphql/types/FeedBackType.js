'use strict';

const FeedBackTagType = require('./FeedBackTagType');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLFloat = graphql.GraphQLFloat,
    GraphQLList = graphql.GraphQLList,
    GraphQLBoolean = graphql.GraphQLBoolean,
    GraphQLID = graphql.GraphQLID;

const FeedBackType = new GraphQLObjectType({
  name: "Feedback",
  fields: () => ({
    restaurantId: {type: GraphQLID},
    restaurantName: {type: GraphQLString},
    userId: {type: GraphQLID},
    userName: {type: GraphQLString},
    userVisitedRestaurantAt: {type: GraphQLInt},
    stampCountOfCard: {type: GraphQLInt},
    employeeName: {type: GraphQLString},
    rating: {type: GraphQLFloat},
    createdAt: {type: GraphQLInt},
    updatedAt: {type: GraphQLInt},
    //questions: {type: new GraphQLList(QuestionAnswerType)},
    tags: {type: new GraphQLList(FeedBackTagType)},
    comment: {type: GraphQLString},
    userContactName: {type: GraphQLString},
    userContact: {type: GraphQLString},
    isFirstTime: {type: GraphQLBoolean},
    visitTimes: {type: GraphQLInt},
    timePeriod: {type: GraphQLString},
    userPictureURL: {type: GraphQLString},
    isResolved: {type: GraphQLBoolean},
  }),
});

module.exports = FeedBackType;