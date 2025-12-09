import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "yamabiko.proxy.rlwy.net",
  user: "root",
  password: "fypYPhDFrAvtTBggnkXqIfzPLAffikwb", 
  database: "railway",
  port: 56392,
});

export default pool;
