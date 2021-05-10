const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'admin', 
    database: 'football'
});

module.exports = connection;