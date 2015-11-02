var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

module.exports = {
  connect: function(cb){
    var link = mysql.createConnection({
      user: "root",
      password: "",
      database: "chat"
    });
    link.connect(function(err, cb){
      if(!err) {
          console.log("Database is connected ... \n\n");

      } else {
          console.log("Error connecting database ... \n\n");  
      }
    });
    return link;
  },

  // connection: this.exports.connect()
};
