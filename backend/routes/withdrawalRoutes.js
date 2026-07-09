const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, method,  wallet_address } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Enter a valid withdrawal amount.",
      });
    }

    if (!method || ! wallet_address) {
      return res.status(400).json({
        message: "Please provide withdrawal method and account details.",
      });
    }

    const settingsResult = await pool.query(
      "SELECT minimum_withdrawal, withdrawals_enabled FROM settings LIMIT 1"
    );

    const settings = settingsResult.rows[0];

    if (!settings.withdrawals_enabled) {
      return res.status(403).json({
        message: "Withdrawals are currently disabled.",
      });
    }

    if (Number(amount) < Number(settings.minimum_withdrawal)) {
      return res.status(400).json({
        message: `Minimum withdrawal is $${settings.minimum_withdrawal}`,
      });
    }

    const userResult = await pool.query(
      "SELECT balance FROM users WHERE id = $1",
      [req.user.id]
    );

    const balance = Number(userResult.rows[0].balance);

    if (balance < Number(amount)) {
      return res.status(400).json({
        message: "Insufficient wallet balance.",
      });
    }

    await pool.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [amount, req.user.id]
    );

    const withdrawalResult = await pool.query(
      `
      INSERT INTO withdrawals
      (user_id, amount, method,  wallet_address)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [req.user.id, amount, method,  wallet_address]
    );

    await pool.query(
      `
      INSERT INTO wallet_transactions
      (user_id, type, amount, description)
      VALUES ($1, $2, $3, $4)
      `,
      [
        req.user.id,
        "withdrawal",
        amount,
        `${method} withdrawal request submitted`,
      ]
    );

    res.status(201).json({
      message: "Withdrawal request submitted successfully.",
      withdrawal: withdrawalResult.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/my-withdrawals", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM withdrawals
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;