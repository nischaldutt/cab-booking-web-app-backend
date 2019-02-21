/******* MYSQL CONNECTION *******/

const  mysql            = require('mysql')

//create database connection
const connection = mysql.createConnection({
  multipleStatements          : true,
  host                        : 'localhost',
  user                        : 'root',
  database                    : 'JugnooDB'
});

//connect to the database
connection.connect((err) => {
  if(err) {
      console.log(err)
  }
  else {
      console.log('mysql DB connected!')
  }
})

module.exports = connection