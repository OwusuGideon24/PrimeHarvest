const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================
DEPOSIT
==================================
*/

router.post("/deposit", authMiddleware, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Invalid deposit amount",
      });
    }

    const updatedUser = await client.query(
      `
      UPDATE users
      SET balance = balance + $1
      WHERE id = $2
      RETURNING balance
      `,
      [amount, req.user.id]
    );

    await client.query(
      `
      INSERT INTO wallet_transactions
      (user_id, type, amount, status, description)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        req.user.id,
        "Deposit",
        amount,
        "Completed",
        `Wallet deposit of $${amount}`,
      ]
    );

    await client.query("COMMIT");

    res.json({
      message: "Deposit successful",
      balance: updatedUser.rows[0].balance,
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  } finally {
    client.release();
  }
});

/*
==================================
TRANSACTIONS
==================================
*/

router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        type,
        amount,
        status,
        description,
        created_at
      FROM wallet_transactions
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

/*
==================================
INVEST
==================================
*/

router.post("/invest", authMiddleware, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      plan_name,
      amount,
      daily_return,
      duration_days,
      total_return,
    } = req.body;

    const balanceResult = await client.query(
      "SELECT balance FROM users WHERE id = $1",
      [req.user.id]
    );

    const balance = Number(balanceResult.rows[0].balance);

    if (balance < Number(amount)) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Insufficient wallet balance",
      });
    }

    await client.query(
      `
      UPDATE users
      SET balance = balance - $1
      WHERE id = $2
      `,
      [amount, req.user.id]
    );

    await client.query(
      `
      INSERT INTO investments
      (
        user_id,
        plan_name,
        amount,
        daily_return,
        duration_days,
        total_return,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,'active')
      `,
      [
        req.user.id,
        plan_name,
        amount,
        daily_return,
        duration_days,
        total_return,
      ]
    );

    await client.query(
      `
      INSERT INTO wallet_transactions
      (
        user_id,
        type,
        amount,
        status,
        description
      )
      VALUES
      ($1,$2,$3,$4,$5)
      `,
      [
        req.user.id,
        "Investment",
        amount,
        "Completed",
        `${plan_name} purchased`,
      ]
    );

    await client.query("COMMIT");

    res.json({
      message: "Investment purchased successfully",
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  } finally {
    client.release();
  }
});
/*
==================================
GET USER INVESTMENTS
==================================
*/

router.get("/investments", authMiddleware, async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM investments
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

/*
==================================
CREATE WITHDRAWAL REQUEST
==================================
*/

router.post("/withdraw", authMiddleware, async (req, res) => {
  try {
    const { amount, wallet_address, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid withdrawal amount",
      });
    }

    if (!wallet_address) {
      return res.status(400).json({
        message: "Wallet address is required",
      });
    }

    // Get current balance
    const userResult = await pool.query(
      "SELECT balance FROM users WHERE id = $1",
      [req.user.id]
    );

    const balance = Number(userResult.rows[0].balance);

    if (balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // Lock (deduct) the funds immediately
    await pool.query(
      `
      UPDATE users
      SET balance = balance - $1
      WHERE id = $2
      `,
      [amount, req.user.id]
    );

    // Create withdrawal request
    const withdrawal = await pool.query(
      `
      INSERT INTO withdrawals
      (
        user_id,
        amount,
        wallet_address,
        method
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        req.user.id,
        amount,
        wallet_address,
        method || "USDT",
      ]
    );

    // Record transaction
    await pool.query(
      `
      INSERT INTO wallet_transactions
      (
        user_id,
        type,
        amount,
        description
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        req.user.id,
        "withdrawal",
        amount,
        "Withdrawal request submitted",
      ]
    );

    res.json({
      message: "Withdrawal request submitted",
      withdrawal: withdrawal.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  }
});

/*
==================================
GET USER WITHDRAWALS
==================================
*/

router.get("/withdrawals", authMiddleware, async (req, res) => {
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