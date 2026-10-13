// backend/db.js
// 4e - Here we establish the connection between the API and the MySQL database
//      using Express (server) + the mysql2 driver (this file).
// 5e - The database used here is created by database/database.sql.
require('dotenv').config();                 // loads values from backend/.env
const mysql = require('mysql2/promise');    // 4e: the MySQL driver (promise version)
const { labelLog } = require('./labels');   // labels helper (no-op when labels are off)

// This pool keeps a few connections open and reuses them for every request.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'restaurant_db',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true                      // returns DECIMAL columns as numbers, not strings
});

// This is used at server start to test the connection and print the DB labels.
async function testConnection() {
  const conn = await pool.getConnection();   // 4e: API <-> database connection happens here
  await conn.ping();
  conn.release();
  labelLog('4e', 'db.js - mysql2 connection pool');
  // Console labels for the database/SQL items (their code lives in database/database.sql)
  labelLog('5a', 'database.sql - CREATE DATABASE + CREATE TABLE users');
  labelLog('5b', 'database.sql - CREATE TABLE / INSERT INTO / UPDATE');
  labelLog('5c', 'database.sql - subqueries (section 5c)');
  labelLog('5d', 'database.sql - script file to open in MySQL Workbench');
  labelLog('5e', 'database/database.sql used by backend/db.js');
}

module.exports = { pool, testConnection };
