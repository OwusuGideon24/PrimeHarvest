const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query(
      `
      SELECT
        id,
        referral_code,
        referral_earnings
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    const referralsResult = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        referral_rewarded,
        created_at
      FROM users
      WHERE referred_by = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    const settingsResult = await pool.query(
      "SELECT referral_bonus FROM settings LIMIT 1"
    );

    res.json({
      referral_code: userResult.rows[0].referral_code,
      referral_earnings: userResult.rows[0].referral_earnings,
      reward_per_referral: settingsResult.rows[0].referral_bonus,
      total_referrals: referralsResult.rows.length,
      referrals: referralsResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;