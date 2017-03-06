const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('../serverless/graphql/schema');

const app = express();

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log("Listening port on 4000");
});