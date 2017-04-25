'use strict';
let AWS = require('./config').AWS;

const updateUser = require('./userUpdate');

const userNomiiAdminSet = (userId) => {
  return updateUser(userId, {isNomiiAdmin: true});
};

module.exports = userNomiiAdminSet;
