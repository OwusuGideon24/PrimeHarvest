const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/settings", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, full_name, email
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/settings", authMiddleware, async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({
        message: "Full name and email are required.",
      });
    }

    const existingEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, req.user.id]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        message: "Email is already used by another account.",
      });
    }

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `
        UPDATE users
        SET full_name = $1, email = $2, password = $3
        WHERE id = $4
        `,
        [full_name, email, hashedPassword, req.user.id]
      );
    } else {
      await pool.query(
        `
        UPDATE users
        SET full_name = $1, email = $2
        WHERE id = $3
        `,
        [full_name, email, req.user.id]
      );
    }

    res.json({
      message: "Settings updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;