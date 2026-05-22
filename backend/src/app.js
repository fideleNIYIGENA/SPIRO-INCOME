const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const driverRoutes = require("./routes/driverRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// PostgreSQL connection
const { pool } = require("./config/db");

const app = express();

const allowedOrigins = new Set([
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json());
app.use(morgan("dev"));

// TEST DATABASE CONNECTION
pool.connect()
  .then(() => {
    console.log("✅ Neon PostgreSQL connected");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

// ROUTES
app.get("/", (req, res) => {
  res.json({
    message: "Moto Income API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

module.exports = app;