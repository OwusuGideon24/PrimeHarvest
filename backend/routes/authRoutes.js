const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================
REGISTER
==================================
*/
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password, referral_code } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newReferralCode =
      "PH" + Math.random().toString(36).substring(2, 8).toUpperCase();

    let referredBy = null;

    if (referral_code) {
      const referrerResult = await pool.query(
        "SELECT id FROM users WHERE referral_code = $1",
        [referral_code]
      );

      if (referrerResult.rows.length === 0) {
        return res.status(400).json({
          message: "Invalid referral code",
        });
      }

      referredBy = referrerResult.rows[0].id;
    }

    const result = await pool.query(
      `INSERT INTO users
      (full_name, email, password, referral_code, referred_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, email, referral_code, balance, referred_by`,
      [full_name, email, hashedPassword, newReferralCode, referredBy]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

/*
==================================
LOGIN
==================================
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = userResult.rows[0];

    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact support.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        balance: user.balance,
        referral_code: user.referral_code,
        role: user.role,
        status: user.status,
      },
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
LOGGED IN USER
==================================
*/
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        balance,
        referral_code,
        role,
        status
      FROM users
      WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;