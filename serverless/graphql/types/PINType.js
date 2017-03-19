'use strict';
// require('es6-promise').polyfill();

const _ = require('lodash');
const db = require('../database');
const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt;

const PINType = new GraphQLObjectType({
  name: "PIN",
  fields: () => ({
    code: {type: GraphQLString},
    employeeName: {type: GraphQLString},
    usageCount: {type: GraphQLInt},
    id: {type: GraphQLString},
  }),
});

module.exports = PINType;