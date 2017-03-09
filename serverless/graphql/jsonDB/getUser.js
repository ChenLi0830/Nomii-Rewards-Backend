'use strict';
const getUser = (userId) => {
  return fetch(`http://localhost:3000/users/${userId}`)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      });
};

module.exports = getUser;