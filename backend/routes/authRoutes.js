const crypto = require("crypto");
const {
  sendPasswordResetEmail,
} = require("../services/emailService");
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

/*
==================================
FORGOT PASSWORD
==================================
*/
router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Please provide your email address",
      });
    }

    const genericResponse = {
      message:
        "If an account exists for that email, a password reset link has been sent.",
    };

    const userResult = await pool.query(
      `SELECT id, full_name, email
       FROM users
       WHERE LOWER(email) = $1
       LIMIT 1`,
      [email]
    );

    /*
    Always return the same response so attackers cannot discover
    which email addresses are registered.
    */
    if (userResult.rows.length === 0) {
      return res.json(genericResponse);
    }

    const user = userResult.rows[0];

const rawToken = crypto.randomBytes(32).toString("hex");

const tokenHash = crypto
  .createHash("sha256")
  .update(rawToken)
  .digest("hex");

/*
Invalidate previous unused reset tokens.
*/
await pool.query(
  `UPDATE password_reset_tokens
   SET used_at = CURRENT_TIMESTAMP
   WHERE user_id = $1
     AND used_at IS NULL`,
  [user.id]
);

/*
Store the new token.
*/
await pool.query(
  `INSERT INTO password_reset_tokens
   (user_id, token_hash, expires_at)
   VALUES (
     $1,
     $2,
     CURRENT_TIMESTAMP + INTERVAL '30 minutes'
   )`,
  [user.id, tokenHash]
);

const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:5173";

const resetUrl =
  `${frontendUrl}/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail({
        recipientEmail: user.email,
        recipientName: user.full_name,
        resetUrl,
      });
    } catch (emailError) {
      console.error(
        "Password reset email failed:",
        emailError.message
      );

      /*
      Invalidate the token if the email could not be delivered.
      */
      await pool.query(
        `UPDATE password_reset_tokens
         SET used_at = CURRENT_TIMESTAMP
         WHERE token_hash = $1`,
        [tokenHash]
      );

      return res.status(500).json({
        message:
          "The password reset email could not be sent. Please try again later.",
      });
    }

    return res.json(genericResponse);
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message:
        "The password reset request could not be processed.",
    });
  }
});

/*
==================================
VERIFY RESET TOKEN
==================================
*/
router.get("/reset-password/:token", async (req, res) => {
  try {
    const rawToken = String(req.params.token || "");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const tokenResult = await pool.query(
      `SELECT id
       FROM password_reset_tokens
       WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > CURRENT_TIMESTAMP
       LIMIT 1`,
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        valid: false,
        message:
          "This password reset link is invalid or has expired.",
      });
    }

    return res.json({
      valid: true,
      message: "Password reset link is valid.",
    });
  } catch (error) {
    console.error("Reset token verification error:", error);

    return res.status(500).json({
      valid: false,
      message: "Unable to verify the password reset link.",
    });
  }
});

/*
==================================
RESET PASSWORD
==================================
*/
router.post("/reset-password", async (req, res) => {
  const client = await pool.connect();

  try {
    const rawToken = String(req.body.token || "");
    const newPassword = String(req.body.password || "");

    if (!rawToken || !newPassword) {
      return res.status(400).json({
        message: "Reset token and new password are required.",
      });
    }

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    if (
      newPassword.length < 8 ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber
    ) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.",
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await client.query("BEGIN");

    const tokenResult = await client.query(
      `SELECT
         password_reset_tokens.id,
         password_reset_tokens.user_id
       FROM password_reset_tokens
       WHERE password_reset_tokens.token_hash = $1
         AND password_reset_tokens.used_at IS NULL
         AND password_reset_tokens.expires_at > CURRENT_TIMESTAMP
       FOR UPDATE`,
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message:
          "This password reset link is invalid or has expired.",
      });
    }

    const resetRecord = tokenResult.rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await client.query(
      `UPDATE users
       SET password = $1
       WHERE id = $2`,
      [hashedPassword, resetRecord.user_id]
    );

    await client.query(
      `UPDATE password_reset_tokens
       SET used_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
         AND used_at IS NULL`,
      [resetRecord.user_id]
    );

    await client.query("COMMIT");

    return res.json({
      message:
        "Your password has been reset successfully. You can now log in.",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Your password could not be reset.",
    });
  } finally {
    client.release();
  }
});

module.exports = router;