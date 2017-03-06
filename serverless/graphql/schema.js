const __graphql = require('graphql');
const GraphQLSchema = __graphql.GraphQLSchema,
    GraphQLObjectType = __graphql.GraphQLObjectType,
    GraphQLString = __graphql.GraphQLString,
    graphql = __graphql.graphql;

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  })
});

module.exports = schema;