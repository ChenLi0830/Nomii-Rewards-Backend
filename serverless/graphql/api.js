"use strict";

const getTimeInSec = () => {
  return Math.trunc(new Date().getTime()/1000);
};

/**
* Get the urgency level of a card, namely, how soon is it going to expire (0 - very urgent, 1 - urgent, 2 - normal)
* */
const getUrgency = (stampValidDays, expireInDays) => {
  console.log("stampValidDays, expireInDays", stampValidDays, expireInDays);
  let urgencyArray = [
    [2, 4, 7],
    [3, 7, 14],
    [5, 15, 30],
  ];
  // Get correct row
  let row;
  for (row=0; row<urgencyArray.length; row++){
    // row is found
    if (urgencyArray[row][2]>=stampValidDays) break;
  }
  if (row === urgencyArray.length) row--;
  
  // Get urgency
  let urgency;
  for (urgency = 0; urgency<urgencyArray[row].length; urgency++){
    // urgencyLevel is found
    if (urgencyArray[row][urgency] >= expireInDays) break;
  }
  if (urgency === urgencyArray[0].length) urgency--;
  return urgency;
};

module.exports = {getTimeInSec, getUrgency};