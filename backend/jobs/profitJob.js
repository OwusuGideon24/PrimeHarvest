const cron = require("node-cron");
const pool = require("../config/db");

function startProfitJob() {
  // Runs every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily profit job...");

    try {
      const investments = await pool.query(`
        SELECT *
        FROM investments
        WHERE completed = FALSE
      `);

      let processed = 0;

      for (const investment of investments.rows) {
        const today = new Date().toISOString().split("T")[0];

        if (
          investment.last_profit_date &&
          investment.last_profit_date.toISOString().split("T")[0] === today
        ) {
          continue;
        }

        // Credit wallet
        await pool.query(
          `
          UPDATE users
          SET balance = balance + $1
          WHERE id = $2
          `,
          [investment.daily_return, investment.user_id]
        );

        // Update investment
        await pool.query(
          `
          UPDATE investments
          SET
            earned = earned + $1,
            days_completed = days_completed + 1,
            last_profit_date = CURRENT_DATE
          WHERE id = $2
          `,
          [investment.daily_return, investment.id]
        );

        // Record transaction
        await pool.query(
          `
          INSERT INTO wallet_transactions
          (user_id, type, amount, description)
          VALUES ($1, $2, $3, $4)
          `,
          [
            investment.user_id,
            "profit",
            investment.daily_return,
            `${investment.plan_name} daily profit`,
          ]
        );

        processed++;

        // Complete investment if finished
        const result = await pool.query(
          `
          SELECT days_completed, duration_days
          FROM investments
          WHERE id = $1
          `,
          [investment.id]
        );

        const current = result.rows[0];

        if (current.days_completed >= current.duration_days) {
          await pool.query(
            `
            UPDATE investments
            SET
              completed = TRUE,
              status = 'Completed'
            WHERE id = $1
            `,
            [investment.id]
          );
        }
      }

      console.log(`Daily profit job complete. Processed ${processed} investments.`);
    } catch (err) {
      console.error("Profit job failed:", err);
    }
  });

  console.log("Daily profit scheduler started.");
}

module.exports = startProfitJob;