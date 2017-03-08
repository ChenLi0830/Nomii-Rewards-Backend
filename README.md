# Nomii-Rewards-Serverless
The serverless backend using GraphQL for Nomii-Rewards App

## Quick Start
Install global dependencies
````
npm install -g serverless firebase-tools 
````
Then install local dependencies
````
npm install
````

Then host local client 
````
npm run dev-client
````

The hosted page is connected to the serverless backend, and it is very useful as references when developing frontend. 

When we have time, we should probably deploy it on a server in the future. 

## Development
The above section discussed how to test and use the remote GraphQL backend.

Here is how to develop the GraphQL, host a fake db server and test it locally.  
````
npm install -g json-server
````

Host local express GraphQL server - it is used to test the GraphQL locally
````
host-server
````

Host fake db server locally 
````
host-fake-db
````
The DB data is in ./serverless/dev/db.json file. The hosted server can take standard CRUD rest API. This is useful when you want to quickly test your schema or tring to avoid direct interaction with a remote database.

After host these two servers locally, you can test your GraphQL layer locally at [localhost:4000/graphql](localhost:4000/graphql) 

##To be continued...



