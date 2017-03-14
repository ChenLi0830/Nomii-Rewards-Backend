'use strict';
const RestaurantTable = require('./config').RestaurantTable;
let AWS = require('./config').AWS;
let docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Get the edges of all cards for a specific user
 * */
const getAllRestaurants = () => {
  const params = {
    TableName: RestaurantTable,
  };
  
  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to get all restaurants. Error JSON:", JSON.stringify(err), err.stack);
        return reject(err);
      }
      let restaurants = data.Items;
      // console.log("user", user);
      // if (!user) user = {};
      console.log("Scan restaurants succeeded:", JSON.stringify(restaurants));
      resolve(restaurants);
    });
  });
};

// const getAllRestaurants = () => {
//   return [
//     {
//       id: "1",
//       name: "Poké Bar SFU",
//       imageURL: "https://s3-us-west-2.amazonaws.com/nomii-rewards-assets/Poke_Bar_Social_Blue_Post%403x.png",
//       longitude: -122.898594,
//       latitude: 49.277691,
//       description: "Hawaiian Restaurant",
//     },
//     {
//       id: "2",
//       name: "Big Smoke Burger",
//       imageURL: "https://s3-us-west-2.amazonaws.com/nomii-rewards-assets/bigsmoke%403x.png",
//       longitude: -123.113764,
//       latitude: 49.270011,
//       description: "Creative burgers, hand-cut fries & shakes round out the menu at this chain with housemade sauces."
//     },
//     {
//       id: "3",
//       name: "India Gate",
//       imageURL: "https://s3-us-west-2.amazonaws.com/nomii-rewards-assets/india-gate%403x.png",
//       longitude: -123.118450,
//       latitude: 49.285792,
//     },
//     {
//       id: "4",
//       name: "Blossom Teas SFU",
//       imageURL: "https://s3-us-west-2.amazonaws.com/nomii-rewards-assets/blossom-teas%403x.png",
//       longitude: -123.118450,
//       latitude: 49.285792,
//     },
//     {
//       id: "5",
//       name: "Russet Shack",
//       imageURL: "https://s3-us-west-2.amazonaws.com/nomii-rewards-assets/russet-shack%403x.png",
//       longitude: -123.118450,
//       latitude: 49.285792,
//     },
//     {
//       id: "6",
//       name: "Viet Sub",
//       imageURL: "https://s3-us-west-2.amazonaws.com/nomii-rewards-assets/viet-sub%403x.png",
//       longitude: -123.118450,
//       latitude: 49.285792,
//     },
//   ]
// };

module.exports = getAllRestaurants;