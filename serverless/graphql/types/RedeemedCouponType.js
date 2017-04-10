'use strict';

const _ = require('lodash');
const db = require('../database');

const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLID = graphql.GraphQLID;

const CouponType = require('./CouponType');

const RedeemedCouponType = new GraphQLObjectType({
  name: "redeemedCoupon",
  fields: () => ({
    redeemedAt: {type: GraphQLInt},
    couponCode: {type: GraphQLString},
    restaurantName: {type: GraphQLString},
    coupon: {
      type: CouponType,
      resolve(parentValue){
        return db.couponGet(parentValue.couponCode);
      },
    }
  }),
});

module.exports = RedeemedCouponType;