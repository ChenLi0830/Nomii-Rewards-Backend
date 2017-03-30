'use strict';
const handle = require('./graphql/index'); // eslint-disable-line import/no-unresolved

module.exports.graphql = (event, context, callback) => {
  // let response = {
  //   statusCode: 200,
  //   headers: {"Access-Control-Allow-Origin": "*"},
  // };
  // callback(null, response);
  if (!event.body) {
    console.log("Scheduled post request event");
    let response = {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin": "*"},
    };
    return callback(null, response);
  }
  
  if (typeof event.body === "string") event.body = JSON.parse(event.body);
  console.log("body", event.body);
  // event.body = JSON.parse(event.body);
  // console.log(handle);

  handle(event.body.query, event.body.variables)
      .then((result) => {
        // if (result.errors) {
        //   throw result.error;
        // }
  
        console.log("result", result);
        // result
  
        let response = {
          statusCode: 200,
          headers: {"Access-Control-Allow-Origin": "*"},
          body: JSON.stringify({
            data: result.data,
            errors: result.errors
          }),
        };
        
        // console.log("response", JSON.stringify(response));
        callback(null, response);
      })
      .catch((error) => callback(error));
};

