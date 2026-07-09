const express = require("express");
const pool = require("../config/db");

const router = express.Router();

/*
========================================
PROCESS DAILY PROFITS
========================================
*/

router.post("/process", async (req, res) => {
  try {

    // Get all active investments
    const investments = await pool.query(`
      SELECT *
      FROM investments
      WHERE completed = FALSE
    `);

    let processed = 0;

    for (const investment of investments.rows) {

      const today = new Date().toISOString().split("T")[0];

      // Skip if today's profit has already been processed
      if (
        investment.last_profit_date &&
        investment.last_profit_date.toISOString().split("T")[0] === today
      ) {
        continue;
      }

      // Credit user's wallet
      await pool.query(
        `
        UPDATE users
        SET balance = balance + $1
        WHERE id = $2
        `,
        [
          investment.daily_return,
          investment.user_id,
        ]
      );

      // Update investment progress
      await pool.query(
        `
        UPDATE investments
        SET
          earned = earned + $1,
          days_completed = days_completed + 1,
          last_profit_date = CURRENT_DATE
        WHERE id = $2
        `,
        [
          investment.daily_return,
          investment.id,
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
        VALUES
        ($1,$2,$3,$4)
        `,
        [
          investment.user_id,
          "profit",
          investment.daily_return,
          `${investment.plan_name} daily profit`,
        ]
      );

      processed++;

      // Finish investment if duration reached
      const updated = await pool.query(
        `
        SELECT
          days_completed,
          duration_days
        FROM investments
        WHERE id=$1
        `,
        [investment.id]
      );

      if (
        updated.rows[0].days_completed >=
        updated.rows[0].duration_days
      ) {

        await pool.query(
          `
          UPDATE investments
          SET completed = TRUE,
              status = 'Completed'
          WHERE id = $1
          `,
          [investment.id]
        );

      }

    }

    res.json({
      message: "Daily profits processed successfully",
      processed,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  }
});

router.get("/plans", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM investment_plans
      WHERE status='Active'
      ORDER BY investment_amount ASC
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  }

});
module.exports = router;