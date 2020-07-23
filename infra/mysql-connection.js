// MySQL
const mysql = require('mysql');

// MySQl
let pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSW,
    database: process.env.DB_NAME
});


module.exports = pool;