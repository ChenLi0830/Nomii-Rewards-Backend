"use strict";

const getTimeInSec = () => {
  return Math.trunc(new Date().getTime()/1000);
};

module.exports = {getTimeInSec};