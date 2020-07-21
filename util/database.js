const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'b6d3fcefec5eae',
  database: 'heroku_ae2a15af970af40',
  password: '9ace8f97',
});

module.exports = pool.promise();
