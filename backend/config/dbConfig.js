const fs = require("fs");
const path = require("path");

let envPath;
if (process.env.NODE_ENV === "development") {
  envPath = path.resolve(__dirname, "../.env.local");
} else {
  envPath = path.resolve(__dirname, "../.env");
}

if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

module.exports = pool;
