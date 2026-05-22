const serverless = require("serverless-http");
const app = require("../src/app");
const { initializeDatabase } = require("../src/utils/initDb");

// initialize DB on cold start; if it fails, log and allow handler to respond with errors
initializeDatabase().catch((err) => {
  console.error("Failed to initialize Moto Income database on serverless start:", err.message);
});

module.exports = serverless(app);
