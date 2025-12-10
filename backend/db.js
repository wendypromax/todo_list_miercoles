// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost", // o el host que uses en Railway
  user: "root",      // tu usuario
  password: "",      // tu contraseña
  database: "todo_list" // nombre de tu base de datos
});

db.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

module.exports = db;
