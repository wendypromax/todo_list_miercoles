const mysql = require('mysql2');

require('dotenv').config({ path: process.env.DOTENV_PATH || '../../.env' });

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todo_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
});

db.connect(err => {
  if (err) {
    console.error('❌ Error de conexión:', err.message || err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

module.exports = db;
