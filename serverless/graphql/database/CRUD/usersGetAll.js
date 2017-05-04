'use strict';
const UserTable = require('../config').UserTable;
const getAll = require('./getAll');

const getAllUsers = (options = {}) => {
  return getAll(UserTable, options);
};

module.exports = getAllUsers;