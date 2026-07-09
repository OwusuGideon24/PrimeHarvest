require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const profitRoutes = require("./routes/profitRoutes");
const startProfitJob = require("./jobs/profitJob");
const adminRoutes = require("./routes/adminRoutes");
const depositRoutes = require("./routes/depositRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const referralRoutes = require("./routes/referralRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/profit", profitRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/user", userRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "PrimeHarvest API connected to PostgreSQL 🚀",
      database_time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Database connection failed",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

startProfitJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});