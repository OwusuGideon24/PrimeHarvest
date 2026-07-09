const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/settings", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        minimum_deposit,
        deposits_enabled,
        usdt_trc20_wallet,
        usdt_bep20_wallet,
        bitcoin_wallet,
        ethereum_wallet
      FROM settings
      LIMIT 1
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, network, transaction_reference } = req.body;

    const settingsResult = await pool.query("SELECT * FROM settings LIMIT 1");
    const settings = settingsResult.rows[0];

    if (!settings.deposits_enabled) {
      return res.status(403).json({
        message: "Deposits are currently disabled.",
      });
    }

    if (!amount || Number(amount) < Number(settings.minimum_deposit)) {
      return res.status(400).json({
        message: `Minimum deposit is $${settings.minimum_deposit}`,
      });
    }

    if (!network) {
      return res.status(400).json({
        message: "Please select a deposit network.",
      });
    }

    const walletMap = {
      "USDT TRC20": settings.usdt_trc20_wallet,
      "USDT BEP20": settings.usdt_bep20_wallet,
      BTC: settings.bitcoin_wallet,
      ETH: settings.ethereum_wallet,
        "MTN MOMO": settings.usdt_bep20_wallet,

    };

    const wallet_address = walletMap[network];

    if (!wallet_address) {
      return res.status(400).json({
        message: "Wallet address not configured for this network.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO deposits
      (user_id, amount, network, wallet_address, transaction_reference)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [req.user.id, amount, network, wallet_address, transaction_reference || null]
    );

    res.status(201).json({
      message: "Deposit request submitted successfully.",
      deposit: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-deposits", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM deposits
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;