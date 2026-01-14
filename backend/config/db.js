/*
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }  // Required for Neon (cloud Postgres)
});

module.exports = pool;
*/
import { neon } from "@neondatabase/serverless";

import "dotenv/config";

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DB_URL);


export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS history(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      link  VARCHAR(255) NOT NULL,
      result  VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}
  