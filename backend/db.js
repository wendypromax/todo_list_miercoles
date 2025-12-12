// backend/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Railway requiere SSL sin verificación estricta
  }
});

// Probar conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error al conectar a PostgreSQL:", err.stack);
  } else {
    console.log("✅ Conectado a PostgreSQL");
    release();
  }
});

module.exports = pool;
