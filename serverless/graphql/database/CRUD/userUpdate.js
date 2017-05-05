'use strict';
const UserTable = require('../config').UserTable;
const update = require('./update');
/**
 * Update user whose id === `userId`
 * */
const updateUser = (userId, newFields, options = {}) => {
  return update(UserTable, {id: userId}, newFields, options)
};

module.exports = updateUser;