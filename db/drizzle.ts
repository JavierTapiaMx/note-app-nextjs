import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Validate required environment variable
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not defined. " +
      "Please add it to your .env.local file."
  );
}

// Create connection pool with proper configuration
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export const db = drizzle(pool);
