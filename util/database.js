const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'dating',
  password: 'lev13081993lev=',
});

module.exports = pool.promise();
