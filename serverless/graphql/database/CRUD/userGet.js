'use strict';
const UserTable = require('../config').UserTable;
const get = require('./get');

const getUser = (userId) => {
  return get(UserTable, {id: userId});
};

module.exports = getUser;