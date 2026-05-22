require("dotenv").config();

const app = require("./app");
const { pool } = require("./config/db");

const port = process.env.PORT || 5000;

// TEST DATABASE CONNECTION
pool.connect()
  .then(() => {
    console.log("✅ Neon PostgreSQL connected");

    app.listen(port, () => {
      console.log(`🚀 Moto Income API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect database:", error.message);
    process.exit(1);
  });