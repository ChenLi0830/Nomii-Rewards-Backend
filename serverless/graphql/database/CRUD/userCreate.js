'use strict';
const UserTable = require('../config').UserTable;
const create = require('./create');

const createUser = (args) => {
  return create(UserTable, args);
};

module.exports = createUser;