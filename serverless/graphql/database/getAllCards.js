'use strict';
const getAllCards = () => {
  return [
    {
      id: "1",
      name: "Poké Bar SFU",
      imageURL: "https://s3-us-west-2.amazonaws.com/nomii-rewards-assets/Poke_Bar_Social_Blue_Post%403x.png",
      longitude: -122.898594,
      latitude: 49.277691,
      description: "Hawaiian Restaurant",
    },
    {
      id: "2",
      name: "Big Smoke Burger",
      imageURL: "https://s3-us-west-2.amazonaws.com/nomii-rewards-assets/bigsmoke%403x.png",
      longitude: -123.113764,
      latitude: 49.270011,
      description: "Creative burgers, hand-cut fries & shakes round out the menu at this chain with housemade sauces."
    },
    {
      id: "3",
      name: "India Gate",
      imageURL: "https://s3-us-west-2.amazonaws.com/nomii-rewards-assets/india-gate%403x.png",
      longitude: -123.118450,
      latitude: 49.285792,
    },
  ]
};

// const cardContentList = [
//   {
//     name: "Poké Bar SFU",
//     distance: 128,
//     logo: require("../../public/images/temp/Poke_Bar_Social_Blue_Post.png"),
//     progress: 1,
//     expireAt: new Date().getTime() + 1000 * 3600 * 24 * 1,
//   },
//   {
//     name: "Big Smoke Burger",
//     distance: 87,
//     logo: require("../../public/images/temp/bigsmoke.png"),
//     progress: 0,
//   },
//   {
//     name: "Blossom Teas SFU",
//     distance: 3212,
//     logo: require("../../public/images/temp/blossom-teas.png"),
//     progress: 2,
//     expireAt: new Date().getTime() + 1000 * 3600 * 24 * 3,
//   },
//   {
//     name: "India Gate",
//     distance: 632,
//     logo: require("../../public/images/temp/india-gate.png"),
//     progress: 2,
//   },
//   {
//     name: "Russet Shack",
//     distance: 18,
//     logo: require("../../public/images/temp/russet-shack.png"),
//     progress: 0,
//   },
//   {
//     name: "Viet Sub",
//     distance: 2112,
//     logo: require("../../public/images/temp/viet-sub.png"),
//     progress: 2,
//   },
// ];

module.exports = getAllCards;