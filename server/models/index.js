var db = require('../db');




module.exports = {
  messages: {
    get: function (cb) { // a function which produces all the messages
      // select messages.id, messages.text, messages.roomname from messages \
      // left outer join users on (messages.userid = users.id) \
      // order by messages.id desc
      var queryString = "SELECT * FROM messages";

      var connection = db.connect();
      connection.query(queryString, function(err, results) {
        if ( !err ) {
          //work with messages in results
          var messageContainer = {results: []};
          for (var i = 0; i < results.length; i++) {
            var messageObj = {};
            messageObj.text = results[i].text;
            messageObj.roomname = results[i].roomname;
            messageObj.username = results[i].userid;
            messageContainer.results.push(messageObj);
          }
          cb(messageContainer);
        } else {
          throw err;
        }
      });
    },
    post: function (dataOb) { // a function which can be used to insert a message into the database
      var userid, text, roomname;
      // test message
      userid = 1;
      text = dataOb.text || 'some default message';
      roomname = dataOb.roomname || 'lobby';
      var queryString = "INSERT INTO messages ( userid, text, roomname ) VALUES ( ?, ?, ? )";
      var queryArgs = [userid, text, roomname];
      var connection = db.connect();
      connection.query( queryString, queryArgs, function(err, results) {
        if (err) {
          throw err;
        } else {
          console.log( 'POST success', results );
        }
      });
    }
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      var queryStr = "select * from users";
      db.query(queryString, function(err, results) {
        callback(results);
      })
    },
    post: function (username) {
      var queryString = "INSERT INTO users ( username ) VALUES ( ? )";
      var queryArgs = [ username ];
      var connection = db.connect();
      connection.query( queryString, queryArgs, function(err, results) {
        if (err) {
          throw err;
        } else {
          console.log( 'POST success', results );
        }
      });
    }
  }
};

