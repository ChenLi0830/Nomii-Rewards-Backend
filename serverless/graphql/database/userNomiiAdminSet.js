'use strict';
const updateUser = require('./CRUD/userUpdate');

const userNomiiAdminSet = (userId) => {
  console.log("userNomiiAdminSet start");
  return updateUser(userId, {isNomiiAdmin: true});
};

module.exports = userNomiiAdminSet;
