'use strict';
// require('es6-promise').polyfill();
require('isomorphic-fetch');

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
    GraphQLID = graphql.GraphQLID;

const UserCardEdge = new GraphQLObjectType({
  name: "UserCardEdge",
  fields: () => ({
    id: {type: GraphQLID},
    stampCount: {type: GraphQLInt},
    lastStampAt: {type: GraphQLString},
    card: {
      type: CardType,
      resolve(parentValue, args){
        return db.getCard(parentValue.id);
      },
    }
  })
});

const CardType = new GraphQLObjectType({
  name: "Card",
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    imageURL: {type: GraphQLString},
    longitude: {type: GraphQLFloat},
    latitude: {type: GraphQLFloat},
    description: {type: GraphQLString},
  })
});

const UserType = new GraphQLObjectType({
  name: 'User', //这个是object名
  fields: () => ({
    id: {type: GraphQLID},
    fbName: {type: GraphQLString},
    cards: {
      type: new GraphQLList(UserCardEdge),
      // resolve(parentValue, args){
      //   return db.getUserCards(parentValue.id);
      // },
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // users: {
    //   type: new GraphQLList(UserType),
    //   resolve: () => {
    //     return fetch(`http://localhost:3000/users`)
    //         .then((response) => {
    //           if (response.status >= 400) {
    //             throw new Error("Bad response from server");
    //           }
    //           return response.json();
    //         });
    //   }
    // },
    userCardEdges: {
      type: new GraphQLList(UserCardEdge),
      args: {userId: {type: GraphQLID}},
      resolve: (parentValue, args) => {
        return db.getUserCards(args.userId);
      }
    },
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve: (parentValue, args) => {
        return db.getUser(args.id);
      },
    },
    edgesOfAllCards: {
      type: new GraphQLList(UserCardEdge),
      args: {userId: {type: GraphQLID}},
      resolve: (parentValue, args) => {
        return db.getAllCardEdges(args.userId);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    upsertUser: {//Update or insert user when one log in from facebook
      type: UserType,
      args: {
        id: {type: GraphQLID},
        fbName: {type: GraphQLString},
      },
      resolve: (parentValue, args)=>{
        return db.upsertUser(args.id, args.fbName);
      }
    },
    redeemPromo: { // Redeem the promo code for a user, and add an additional stamp for all theuser's cards
      type: UserType,
      args: {
        userId: {type: GraphQLID},
      },
      resolve: (parentValue, args)=>{
        return db.addPromoToUser(args.userId);
      }
    },
    stampCard: { // Stamp a card for a user
      type: UserType,
      args: {
        userId: {type: GraphQLID},
        cardId: {type: GraphQLID},
      },
      resolve: (parentValue, args) => {
        return db.stampCard(args.userId, args.cardId);
      },
    },
  }
  //   addCard: {
  //     type: CardType,
  //     args: {
  //       firstName: {type: new GraphQLNonNull(GraphQLString)},
  //       age: {type: new GraphQLNonNull(GraphQLInt)},
  //       companyId: {type: GraphQLString}
  //     },
  //     resolve(parentValue, {firstName, age, companyId}){
  //       return fetch(`http://localhost:3000/users`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           firstName,
  //           age,
  //           companyId
  //         })
  //       })
  //           .then((response) => {
  //             if (response.status >= 400) {
  //               throw new Error("Bad response from server");
  //             }
  //             return response.json();
  //           });
  //     }
  //   },
  //   deleteUser: {
  //     type: UserType,
  //     args: {
  //       id: {type: new GraphQLNonNull(GraphQLString)},
  //     },
  //     resolve(parentValue, args){
  //       return fetch(`http://localhost:3000/users/${args.id}`, {
  //         method: 'DELETE',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       })
  //           .then((response) => {
  //             if (response.status >= 400) {
  //               throw new Error("Bad response from server");
  //             }
  //             return response.json();
  //           });
  //     }
  //   },
  //   editUser: {
  //     type: UserType,
  //     args: {
  //       id: {type: new GraphQLNonNull(GraphQLString)},
  //       firstName: {type: GraphQLString},
  //       age: {type: GraphQLInt},
  //       companyId: {type: GraphQLString},
  //     },
  //     resolve(parentValue, args){
  //       return fetch(`http://localhost:3000/users/${args.id}`, {
  //         method: 'PATCH',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(args)
  //       })
  //           .then((response) => {
  //             if (response.status >= 400) {
  //               throw new Error("Bad response from server");
  //             }
  //             return response.json();
  //           });
  //     }
  //   }
  // },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});