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

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    upsertUser: {//Update or insert user when one log in from facebook
      type: UserType,
      args: {
        id: {type: GraphQLID},
        fbName: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.userUpsert(args.id, args.fbName);
      }
    },
    redeemPromo: { // Redeem the promo code for a user, and add an additional stamp for all theuser's cards
      type: UserType,
      args: {
        userId: {type: GraphQLID},
        code: {type: GraphQLString}
      },
      resolve: (parentValue, args) => {
        return db.userRedeemCoupon(args.userId, args.code);
      }
    },
    stampCard: { // Stamp a card for a user
      type: UserType,
      args: {
        userId: {type: GraphQLID},
        cardId: {type: GraphQLID},
        PIN: {type: GraphQLString}
      },
      resolve: (parentValue, args) => {
        return db.userStampCard(args.userId, args.cardId, args.PIN);
      },
    },
    createPIN: {
      type: RestaurantType,
      args: {
        restaurantId: {type: GraphQLID},
        PIN: {type: GraphQLString},
        employeeName: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.restaurantPINCreate(args.restaurantId, args.PIN, args.employeeName);
      }
    },
    removePIN: {
      type: RestaurantType,
      args: {
        restaurantId: {type: GraphQLID},
        PIN: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.restaurantPINRemove(args.restaurantId, args.PIN);
      }
    },
    createCoupon: {
      type: CouponType,
      args: {
        code: {type: GraphQLString},
        isForAllRestaurants: {type: GraphQLBoolean},
        restaurantId: {type: GraphQLID},
        daysToExpire: {type: GraphQLInt},
        numberOfCoupons: {type: GraphQLInt},
      },
      resolve: (parentValue, args) => {
        return db.couponCreate(
            args.code,
            args.isForAllRestaurants,
            args.restaurantId,
            args.daysToExpire,
            args.numberOfCoupons
        );
      }
    },
    createRestaurant: {
      type: RestaurantType,
      args: {
        name: {type: GraphQLString},
        imageURL: {type: GraphQLString},
        longitude: {type: GraphQLFloat},
        latitude: {type: GraphQLFloat},
        description: {type: GraphQLString},
        address: {type: GraphQLString},
        stampValidDays: {type: GraphQLInt},
      },
      resolve: (parentValue, args) => {
        return db.restaurantCreate(args.name, args.imageURL, args.longitude, args.latitude,
            args.description, args.address, args.stampValidDays);
      }
    },
    addRestaurantOwnership: {
      type: UserType,
      args:{
        userId: {type: GraphQLID},
        restaurantId: {type: GraphQLID},
      },
      resolve: (parentValue, args) => {
        return db.userRestaurantOwnershipAdd(args.userId, args.restaurantId);
      }
    },
    removeRestaurantOwnership: {
      type: UserType,
      args:{
        userId: {type: GraphQLID},
        restaurantId: {type: GraphQLID},
      },
      resolve: (parentValue, args) => {
        return db.userRestaurantOwnershipRemove(args.userId, args.restaurantId);
      }
    }
  }
});

module.exports = mutation;