'use strict';
const getAllCards = () => {
  return [
    {
      id: 1,
      name: "Poké Bar SFU",
      distance: 128,
      imageURL: "../../public/images/temp/Poke_Bar_Social_Blue_Post.png",
      longitude: -122.898594,
      latitude: 49.277691,
      description: "Hawaiian Restaurant",
    },
    {
      id: 2,
      name: "Big Smoke Burger",
      distance: 87,
      imageURL: "../../public/images/temp/bigsmoke.png",
      longitude: -123.113764,
      latitude: 49.270011,
      description: "Creative burgers, hand-cut fries & shakes round out the menu at this chain with housemade sauces."
    },
    {
      id: 3,
      name: "India Gate",
      imageURL: "../../public/images/temp/india-gate.png",
      longitude: -123.118450,
      latitude: 49.285792,
    },
  ]
};

module.exports = getAllCards;