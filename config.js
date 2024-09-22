"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

const { Pool } = require("pg");

// Use connection pooling for database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost/jobly",
});

// Handle successful connection
db.on("connect", () => {
  console.log("Successfully connected to the database".green);
});

// Handle database connection errors
db.on("error", (err) => {
  console.error("Database connection error:".red, err);
  process.exit(1); // Exit the process if there's a critical DB connection error
});

// Function to get the database URI for different environments
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "postgresql://localhost/jobly_test"
    : process.env.DATABASE_URL || "postgresql://localhost/jobly";
}

// Speed up bcrypt during tests, use a lower work factor
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Logging the app configuration
console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR);
console.log("Database URI:".yellow, getDatabaseUri());
console.log("---");

// Export the configuration and the database connection pool
module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  db, // Export the database connection pool
};
