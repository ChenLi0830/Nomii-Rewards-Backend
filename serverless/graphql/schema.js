// const __graphql = require('graphql');
// const GraphQLSchema = __graphql.GraphQLSchema,
//     GraphQLObjectType = __graphql.GraphQLObjectType,
//     GraphQLString = __graphql.GraphQLString,
//     graphql = __graphql.graphql;
//
// var schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
//       hello: {
//         type: GraphQLString,
//         resolve() {
//           return 'world';
//         }
//       }
//     }
//   })
// });
//
// module.exports = schema;


'use strict';
const _ = require('lodash');
const graphql = require('graphql'),
    GraphQLObjectType = graphql.GraphQLObjectType,
    GraphQLString = graphql.GraphQLString,
    GraphQLInt = graphql.GraphQLInt,
    GraphQLSchema = graphql.GraphQLSchema,
    GraphQLList = graphql.GraphQLList,
    GraphQLNonNull = graphql.GraphQLNonNull,
    GraphQLFloat = graphql.GraphQLFloat,
    GraphQLID = graphql.GraphQLID;

// require('es6-promise').polyfill();
require('isomorphic-fetch');

const cardContentList = [
  {
    id: 1,
    name: "Poké Bar SFU",
    distance: 128,
    logo: "../../public/images/temp/Poke_Bar_Social_Blue_Post.png",
  },
  {
    id: 2,
    name: "Big Smoke Burger",
    distance: 87,
    logo: "../../public/images/temp/bigsmoke.png",
  },
  {
    id: 3,
    name: "India Gate",
    distance: 632,
    logo: "../../public/images/temp/india-gate.png",
  },
];

const UserCardEdge = new GraphQLObjectType({
  name: "UserCardEdge",
  fields: () => ({
    stampCount: {type: GraphQLInt},
    lastStampAt: {type: GraphQLString},
    card: {
      type: CardType,
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

// const CompanyType = new GraphQLObjectType({
//   name: "Company",
//   fields: () => ({
//     id: {type: GraphQLString},
//     name: {type: GraphQLString},
//     description: {type: GraphQLString},
//     users: {
//       type: new GraphQLList(UserType),
//       resolve(parentValue, args){
//         return fetch(`http://localhost:3000/companies/${parentValue.id}/users`)
//             .then((response) => {
//               if (response.status >= 400) {
//                 throw new Error("Bad response from server");
//               }
//               return response.json();
//             });
//       }
//     }
//   })
// });

const UserType = new GraphQLObjectType({
  name: 'User', //这个是object名
  fields: () => ({
    id: {type: GraphQLString},
    fbName: {type: GraphQLString},
    cardEdges: {
      type: new GraphQLList(UserCardEdge),
      resolve(parentValue, args){
        // console.log("parentValue.companyId", parentValue.companyId);
        return fetch(`http://localhost:3000/users/${parentValue.id}`)
            .then((response) => {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            })
            .then(user => {
              var cardEdges = user.cards.map(cardEdge => {
                    console.log(cardEdge.id);
                    console.log(_.find(cardContentList, {id: cardEdge.id}));
                    return Object.assign({}, cardEdge, {card: _.find(cardContentList, {id: cardEdge.id})})
                  }
              );
              console.log("cardEdges", cardEdges);
              return cardEdges;
            })
      },
    }
    // cards: {
    //   type: CardType,
    //   resolve(parentValue, args){
    //     // console.log("parentValue.companyId", parentValue.companyId);
    //     return fetch(`http://localhost:3000/companies/${parentValue.companyId}`)
    //         .then((response) => {
    //           if (response.status >= 400) {
    //             throw new Error("Bad response from server");
    //           }
    //           return response.json();
    //         });
    //   },
    // }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: () => {
        return fetch(`http://localhost:3000/users`)
            .then((response) => {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            });
      }
    },
    // userCardEdges: {
    //   type: new GraphQLList(UserCardEdge),
    //   args: {userId: {type: GraphQLString}},
    //   resolve: (parentValue, args) => {
    //     return fetch(`http://localhost:3000/users/${args.userId}`)
    //         .then((response) => {
    //           if (response.status >= 400) {
    //             throw new Error("Bad response from server");
    //           }
    //           return response.json();
    //         })
    //         .then(user => {
    //           var cardEdges = user.cards.map(cardEdge => {
    //                 console.log(cardEdge.id);
    //                 console.log(_.find(cardContentList, {id: cardEdge.id}));
    //                 return Object.assign({}, cardEdge, {card: _.find(cardContentList, {id: cardEdge.id})})
    //               }
    //           );
    //           console.log("cardEdges", cardEdges);
    //           return cardEdges;
    //         })
    //   }
    // },
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve: (parentValue, args) => {
        return fetch(`http://localhost:3000/users/${args.id}`)
            .then((response) => {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
            });
      },
    },
    // company: {
    //   type: CompanyType,
    //   args: {id: {type: GraphQLString}},
    //   resolve: (parentValue, args) => {
    //     return fetch(`http://localhost:3000/companies/${args.id}`)
    //         .then((response) => {
    //           if (response.status >= 400) {
    //             throw new Error("Bad response from server");
    //           }
    //           return response.json();
    //         });
    //   },
    // }
  }
});

// const mutation = new GraphQLObjectType({
//   name: "Mutation",
//   fields: {
//     addUser: {
//       type: UserType,
//       args: {
//         firstName: {type: new GraphQLNonNull(GraphQLString)},
//         age: {type: new GraphQLNonNull(GraphQLInt)},
//         companyId: {type: GraphQLString}
//       },
//       resolve(parentValue, {firstName, age, companyId}){
//         return fetch(`http://localhost:3000/users`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             firstName,
//             age,
//             companyId
//           })
//         })
//             .then((response) => {
//               if (response.status >= 400) {
//                 throw new Error("Bad response from server");
//               }
//               return response.json();
//             });
//       }
//     },
//     deleteUser: {
//       type: UserType,
//       args: {
//         id: {type: new GraphQLNonNull(GraphQLString)},
//       },
//       resolve(parentValue, args){
//         return fetch(`http://localhost:3000/users/${args.id}`, {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         })
//             .then((response) => {
//               if (response.status >= 400) {
//                 throw new Error("Bad response from server");
//               }
//               return response.json();
//             });
//       }
//     },
//     editUser: {
//       type: UserType,
//       args: {
//         id: {type: new GraphQLNonNull(GraphQLString)},
//         firstName: {type: GraphQLString},
//         age: {type: GraphQLInt},
//         companyId: {type: GraphQLString},
//       },
//       resolve(parentValue, args){
//         return fetch(`http://localhost:3000/users/${args.id}`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(args)
//         })
//             .then((response) => {
//               if (response.status >= 400) {
//                 throw new Error("Bad response from server");
//               }
//               return response.json();
//             });
//       }
//     }
//   },
// });

module.exports = new GraphQLSchema({
  query: RootQuery,
  // mutation,
});