var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

module.exports = {
  connect: function(){
    var link = mysql.createConnection({
      user: "root",
      password: "",
      database: "chat"
    });
    link.connect(function(err){
      if(!err) {
          console.log("Database is connected ... \n\n");  
      } else {
          console.log("Error connecting database ... \n\n");  
      }
    });
  }
};
