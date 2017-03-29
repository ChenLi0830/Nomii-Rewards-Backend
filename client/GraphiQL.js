import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';

// Production
// const link = "https://bnbs6szfk8.execute-api.us-west-2.amazonaws.com/dev";

// Staging
const link = "https://p9s1hjsm03.execute-api.us-west-2.amazonaws.com/staging";

function graphQLFetcher(graphQLParams) {
  return fetch(link + '/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

ReactDOM.render(<GraphiQL fetcher={graphQLFetcher} />, document.body);