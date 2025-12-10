// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'caboose.proxy.rlwy.net',
  user: 'root',
  password: 'NraXnkOcWALyplxrkVrQfuNPDuZwFkYX',  // tu contraseña de Railway
  database: 'railway',
  port: 12831
});

db.connect(err => {
  if (err) {
    console.error("Error de conexión:", err);
  } else {
    console.log("Conectado a la base de datos MySQL en Railway");
  }
});

module.exports = db;
