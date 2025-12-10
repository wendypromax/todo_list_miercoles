const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'caboose.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'NraXnkOcWALyplxrkVrQfuNPDuZwFkYX',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 12831
});

db.connect(err => {
  if (err) {
    console.error('❌ Error de conexión:', err.message || err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

module.exports = db;
