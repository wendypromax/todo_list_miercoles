// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'caboose.proxy.rlwy.net', // Host de Railway
  user: 'root',                    // Usuario de Railway
  password: 'NraXnkOcWALyplxrkVrQfuNPDuZwFkYX',       // Contraseña de Railway
  database: 'railway',             // Nombre de la base de datos
  port: 12831                       // Puerto de Railway
});

db.connect(err => {
  if (err) {
    console.error("Error de conexión:", err);
  } else {
    console.log("Conectado a la base de datos en Railway");
  }
});

module.exports = db;
