import { Pool } from "pg";
import config from "../config";

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: config.database_connection_string,
});

// Initialize database tables
export const initDB = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,

        role VARCHAR(20)
        DEFAULT 'contributor'
        CHECK (role IN ('contributor', 'maintainer')),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create issues table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,

        title VARCHAR(150) NOT NULL,

        description TEXT NOT NULL
        CHECK (LENGTH(description) >= 20),

        type VARCHAR(30) NOT NULL
        CHECK (type IN ('bug', 'feature_request')),

        status VARCHAR(30) DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'resolved')),

        reporter_id INTEGER NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database initialized successfully");
  } catch (error: any) {
    console.error("Database initialization failed:", error);
  }
};
