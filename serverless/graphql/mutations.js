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
const FeedBackType = require('./types/FeedBackType');
const FeedBackTagType = require('./types/FeedBackTagType');
const QuestionAnswerInputType = require('./types/QuestionAnswerInputType');

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    upsertUser: {//Update or insert user when one log in from facebook
      type: UserType,
      args: {
        id: {type: GraphQLID},
        fbName: {type: GraphQLString},
        token: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.userUpsert(args.id, args.fbName, args.token);
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
        excludedRestaurants: {
          type: new GraphQLList(GraphQLID),
        },
        discounts: {
          type: new GraphQLList(GraphQLInt)
        },
        PINSuccessScreens: {
          type: new GraphQLList(GraphQLString),
        },
        codeSuccessScreen: {
          type: GraphQLString,
        },
        type: {type: GraphQLString} // stamp | discount
      },
      resolve: (parentValue, args) => {
        return db.couponCreate(
            args.code,
            args.isForAllRestaurants,
            args.restaurantId,
            args.daysToExpire,
            args.numberOfCoupons,
            args.excludedRestaurants,
            args.discounts,
            args.PINSuccessScreens,
            args.codeSuccessScreen,
            args.type // stamp | discount
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
      args: {
        userId: {type: GraphQLID},
        restaurantId: {type: GraphQLID},
      },
      resolve: (parentValue, args) => {
        return db.userRestaurantOwnershipAdd(args.userId, args.restaurantId);
      }
    },
    removeRestaurantOwnership: {
      type: UserType,
      args: {
        userId: {type: GraphQLID},
        restaurantId: {type: GraphQLID},
      },
      resolve: (parentValue, args) => {
        return db.userRestaurantOwnershipRemove(args.userId, args.restaurantId);
      }
    },
    addPushToken: {
      type: UserType,
      args: {
        userId: {type: GraphQLID},
        pushToken: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.userPushTokenAdd(args.userId, args.pushToken);
      }
    },
    addSurveyQuestion: {
      type: RestaurantType,
      args: {
        restaurantId: {type: GraphQLID},
        question: {type: GraphQLString},
        askInRound: {type: GraphQLInt},
        type: {type: GraphQLString},
        maxScore: {type: GraphQLInt},
        textPlaceholder: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.restaurantQuestionAdd(args);
      }
    },
    setUserAdmin: {
      type: UserType,
      args: {
        userId: {type: GraphQLID},
      },
      resolve: (parentValue, args) => {
        return db.userNomiiAdminSet(args.userId);
      }
    },
    addAwaitFeedbackToUser: {
      type: UserType,
      args: {
        userId: {type: GraphQLID},
        restaurantId: {type: GraphQLID},
        stampCountOfCard: {type: GraphQLInt},
        employeeName: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.userAwaitFeedbackAdd(args);
      }
    },
    submitUserFeedback: {
      type: FeedBackType,
      args:{
        restaurantId: {type: GraphQLID},
        userId: {type: GraphQLID},
        userVisitedRestaurantAt: {type: GraphQLInt},
        stampCountOfCard: {type: GraphQLInt},
        employeeName: {type: GraphQLString},
        rating: {type: GraphQLFloat},
        //questions: {type: new GraphQLList(QuestionAnswerInputType)},
        tags: {type: new GraphQLList(GraphQLID)},
        comment: {type: GraphQLString},
        userContact: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.userSubmitFeedback(args);
      }
    },
    createFeedBackTag: {
      type: FeedBackTagType,
      args:{
        content: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        return db.feedbackTagCreate(args);
      }
    },
  }
});

module.exports = mutation;