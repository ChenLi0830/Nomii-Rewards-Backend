'use strict';
const graphql = require('graphql').graphql;
const Schema = require('./schema');

module.exports = (query, variables) => (
  graphql(Schema, query, null, {}, variables)
);
