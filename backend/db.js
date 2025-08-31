// MySQL connection for Bluehost
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '50.6.35.88', // e.g. 'yourdomain.mysql.db'
  user: 'kqtbsgmy_app',
  password: 'x!,Y!xnubX5*',
  database: 'kqtbsgmy_pdc',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
