require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const profitRoutes = require("./routes/profitRoutes");
const adminRoutes = require("./routes/adminRoutes");
const depositRoutes = require("./routes/depositRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const referralRoutes = require("./routes/referralRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const startProfitJob = require("./jobs/profitJob");

const app = express();
const PORT = process.env.PORT || 5000;

/*
==================================
MIDDLEWARE
==================================
*/
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://172.20.10.2:5173",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

/*
==================================
ROUTES
==================================
*/
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/profit", profitRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationRoutes);

/*
==================================
HEALTH CHECK
==================================
*/
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "PrimeHarvest API connected to PostgreSQL 🚀",
      database_time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database health-check error:", error);

    res.status(500).json({
      error: "Database connection failed",
      details: error.message,
    });
  }
});

/*
==================================
START BACKGROUND JOBS
==================================
*/
startProfitJob();

/*
==================================
START SERVER
==================================
*/
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});