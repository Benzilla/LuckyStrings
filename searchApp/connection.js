var mysql = require('mysql');

var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      password : 'Ianbru32',
      database : 'museum',
      port : 3306
    }
);
 
module.exports = connection;
