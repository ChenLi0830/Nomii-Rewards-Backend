'use strict';

const _ = require('lodash');
const db = require('./database');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLSchema = graphql.GraphQLSchema,
    GraphQLList = graphql.GraphQLList,
    GraphQLNonNull = graphql.GraphQLNonNull,
    GraphQLFloat = graphql.GraphQLFloat,
    GraphQLBoolean = graphql.GraphQLBoolean,
    GraphQLID = graphql.GraphQLID;

const PINType = require('./types/PINType');

const CardType = require('./types/CardType');

const RestaurantType = require('./types/RestaurantType');

const RedeemedCouponType = require('./types/RedeemedCouponType');

const CouponType = require('./types/CouponType');

const UserType = require('./types/UserType');

const StampEventType = require('./types/StampEventType');

const RestaurantVisitStatisticsType = require('./types/RestaurantVisitStatisticsType');

const FeedBackType = require('./types/FeedBackType');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve: (parentValue, args) => {
        return db.userGet(args.id);
      },
    },
    allRestaurantCards: {
      type: new GraphQLList(CardType),
      args: {userId: {type: GraphQLID}},
      resolve: (parentValue, args) => {
        return db.userCardGetAll(args.userId);
      }
    },
    coupons: {
      type: new GraphQLList(CouponType),
      resolve: (parentValue, args) => {
        return db.couponGetAll();
      }
    },
    restaurant: {
      type: RestaurantType,
      args: {id: {type: GraphQLID}},
      resolve: (parentValue, args) => {
        return db.restaurantGet(args.id);
      }
    },
    stampEvents: {
      type: new GraphQLList(StampEventType),
      args: {
        restaurantId: {type: GraphQLID},
        daysToCover: {type: GraphQLFloat},
        endTo: {type: GraphQLInt},
      },
      resolve: (parentValue, args) => {
        return db.stampEventGetDuringPeriod(args.restaurantId ,args.daysToCover, args.endTo);
      }
    },
    RestaurantVisitStatistics: {
      type: RestaurantVisitStatisticsType,
      args: {
        restaurantId: {type: GraphQLID},
        daysToCover: {type: GraphQLFloat},
        endTo: {type: GraphQLInt},
      },
      resolve: (parentValue, args) => {
        return db.restaurantVisitStatisticsGet(args.restaurantId, args.daysToCover, args.endTo);
      }
    },
    ratingFeedBacks:{
      type: new GraphQLList(FeedBackType),
      args:{
        restaurantId: {type: GraphQLID},
        daysToCover: {type: GraphQLFloat},
        endTo: {type: GraphQLInt},
      },
      resolve: (parentValue, args) => {
        return db.restaurantRatingFeedbacksGet(args.restaurantId, args.daysToCover, args.endTo);
      }
    },
  }
});

module.exports = RootQuery;