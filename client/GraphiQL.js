import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';

// const link = "https://uo1lwdfvpg.execute-api.us-west-2.amazonaws.com/dev";
const link = "http://localhost:4000/graphql";

function graphQLFetcher(graphQLParams) {
  return fetch(link + '/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

ReactDOM.render(<GraphiQL fetcher={graphQLFetcher} />, document.body);