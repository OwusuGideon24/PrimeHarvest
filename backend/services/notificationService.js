const pool = require("../config/db");

async function createNotification({
  userId,
  type,
  title,
  message,
}) {
  try {
    const result = await pool.query(
      `
      INSERT INTO notifications
      (user_id, type, title, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [userId, type, title, message]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Create notification failed:", error);
    throw error;
  }
}

module.exports = {
  createNotification,
};