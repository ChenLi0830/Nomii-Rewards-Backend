'use strict';
// require('es6-promise').polyfill();
require('isomorphic-fetch');

const _ = require('lodash');
const db = require('./database');
const graphql = require('graphql'),
    GraphQLSchema = graphql.GraphQLSchema;

const RootQuery = require('./rootQuery');
const mutations = require('./mutations');

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations,
});