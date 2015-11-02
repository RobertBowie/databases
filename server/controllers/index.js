var models = require('../models');
var bluebird = require('bluebird');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};

var statusCode;

module.exports = {
  messages: {
    get: function (req, res) { // a function which handles a get request for all messages
      console.log( 'GET request to messages handler incoming! ');
      // send back a res with success code in headers
      statusCode = 200;
      res.writeHead( statusCode, headers );
      models.messages.get( function(mess) {
        // console.log(mess);
        res.end( JSON.stringify(mess) );
      });
    },

    post: function (req, res) { // a function which handles posting a message to the database
      console.log( 'POST request to messages handler incoming!', req.body );
      statusCode = 201;
      console.log('calling DB POST with ', req.body, 'which is a ', typeof req.body);
      models.messages.post(req.body);
      res.writeHead(statusCode, headers);
      res.end(JSON.stringify({results: [req.body]}));
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {
      statusCode = 201;
      console.log('calling USER POST with ', req.body.username, 'which is a ', typeof req.body.username);
      models.users.post(req.body.username);
      res.writeHead(statusCode, headers);
      res.end(); // JSON.stringify({results: [req.body]})
    }
  }
};

