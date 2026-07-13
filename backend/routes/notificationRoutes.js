const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================
GET USER NOTIFICATIONS
==================================
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        type,
        title,
        message,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [req.user.id]
    );

    const unreadResult = await pool.query(
      `
      SELECT COUNT(*)
      FROM notifications
      WHERE user_id = $1
        AND is_read = FALSE
      `,
      [req.user.id]
    );

    res.json({
      unread_count: Number(unreadResult.rows[0].count),
      notifications: result.rows,
    });
  } catch (error) {
    console.error("Fetch notifications failed:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/*
==================================
MARK ONE NOTIFICATION AS READ
==================================
*/
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1
        AND user_id = $2
      RETURNING *
      `,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification marked as read",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Mark notification as read failed:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/*
==================================
MARK ALL NOTIFICATIONS AS READ
==================================
*/
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await pool.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1
        AND is_read = FALSE
      `,
      [req.user.id]
    );

    res.json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read failed:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;