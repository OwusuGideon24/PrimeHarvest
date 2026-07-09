const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/*
==================================
ADMIN DASHBOARD STATS
==================================
*/

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    
    try {

      const users = await pool.query(
        "SELECT COUNT(*) FROM users"
      );

     const investments = await pool.query(`
  SELECT COUNT(*)
  FROM investments
  WHERE LOWER(status) = 'active'
     OR completed = FALSE
`);

      const withdrawals = await pool.query(
        "SELECT COUNT(*) FROM withdrawals WHERE status='Pending'"
      );

      const balance = await pool.query(
        "SELECT COALESCE(SUM(balance),0) FROM users"
      );

      res.json({
        totalUsers: Number(users.rows[0].count),
        activeInvestments: Number(investments.rows[0].count),
        pendingWithdrawals: Number(withdrawals.rows[0].count),
        totalWalletBalance: Number(balance.rows[0].coalesce),
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error",
      });

    }
  }
);
router.get("/withdrawals", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        withdrawals.*,
        users.full_name,
        users.email
      FROM withdrawals
      JOIN users
        ON users.id = withdrawals.user_id
      ORDER BY withdrawals.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        full_name,
        email,
        balance,
        role,
        referral_code
      FROM users
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error",
    });

  }
});
router.put(
  "/withdrawals/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const client = await pool.connect();

    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      await client.query("BEGIN");

      const withdrawalResult = await client.query(
        "SELECT * FROM withdrawals WHERE id = $1 FOR UPDATE",
        [id]
      );

      if (withdrawalResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          message: "Withdrawal not found",
        });
      }

      const withdrawal = withdrawalResult.rows[0];

      if (withdrawal.status !== "Pending") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "This withdrawal has already been processed",
        });
      }

      if (status === "Rejected") {
        await client.query(
          "UPDATE users SET balance = balance + $1 WHERE id = $2",
          [withdrawal.amount, withdrawal.user_id]
        );

        await client.query(
          `
          INSERT INTO wallet_transactions
          (user_id, type, amount, description)
          VALUES ($1, $2, $3, $4)
          `,
          [
            withdrawal.user_id,
            "refund",
            withdrawal.amount,
            `${withdrawal.method} withdrawal rejected - amount refunded`,
          ]
        );
      }

      const result = await client.query(
        `
        UPDATE withdrawals
        SET
          status = $1,
          processed_by = $2,
          processed_at = NOW()
        WHERE id = $3
        RETURNING *
        `,
        [status, req.user.id, id]
      );

      await client.query("COMMIT");

      res.json({
        message: `Withdrawal ${status}`,
        withdrawal: result.rows[0],
      });

    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    } finally {
      client.release();
    }
  }
);
router.get(
    "/users/:id",
    authMiddleware,
     adminMiddleware,
      async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const investmentResult = await pool.query(
      "SELECT * FROM investments WHERE user_id = $1 ORDER BY id DESC",
      [id]
    );

    const transactionResult = await pool.query(
      "SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY id DESC",
      [id]
    );

    const withdrawalResult = await pool.query(
      "SELECT * FROM withdrawals WHERE user_id = $1 ORDER BY id DESC",
      [id]
    );

    res.json({
      user: userResult.rows[0],
      investments: investmentResult.rows,
      transactions: transactionResult.rows,
      withdrawals: withdrawalResult.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
router.put(
  "/users/:id/balance",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, action } = req.body;

      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({
          message: "Invalid amount",
        });
      }

      const user = await pool.query(
        "SELECT balance FROM users WHERE id = $1",
        [id]
      );

      if (user.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      let newBalance = Number(user.rows[0].balance);

      if (action === "add") {
        newBalance += Number(amount);
      } else if (action === "deduct") {
        newBalance -= Number(amount);

        if (newBalance < 0) {
          newBalance = 0;
        }
      } else {
        return res.status(400).json({
          message: "Invalid action",
        });
      }

      const result = await pool.query(
        `
        UPDATE users
        SET balance = $1
        WHERE id = $2
        RETURNING *
        `,
        [newBalance, id]
      );

      res.json({
        message: "Balance updated successfully",
        user: result.rows[0],
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);
router.put(
  "/users/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["active", "suspended"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const result = await pool.query(
        `
        UPDATE users
        SET status = $1
        WHERE id = $2
        RETURNING *
        `,
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: `User ${status} successfully`,
        user: result.rows[0],
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);
router.get(
  "/recent-users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {

      const result = await pool.query(`
        SELECT
          id,
          full_name,
          role,
          status
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error",
      });

    }
  }
);

router.get(
  "/recent-withdrawals",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {

      const result = await pool.query(`
        SELECT
          withdrawals.id,
          withdrawals.amount,
          withdrawals.status,
          withdrawals.method,
          users.full_name
        FROM withdrawals
        JOIN users
          ON users.id = withdrawals.user_id
        ORDER BY withdrawals.created_at DESC
        LIMIT 5
      `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error",
      });

    }
  }
);
router.get(
  "/investments",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {

      const result = await pool.query(`
        SELECT
          investments.*,
          users.full_name,
          users.email
        FROM investments
        JOIN users
          ON users.id = investments.user_id
        ORDER BY investments.id DESC
      `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error",
      });

    }
  }
);
router.get(
  "/transactions",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {

      const result = await pool.query(`
        SELECT
          wallet_transactions.*,
          users.full_name,
          users.email
        FROM wallet_transactions
        JOIN users
          ON users.id = wallet_transactions.user_id
        ORDER BY wallet_transactions.created_at DESC
      `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error",
      });

    }
  }
);
router.get(
  "/settings",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {

      const result = await pool.query(
        "SELECT * FROM settings LIMIT 1"
      );

      res.json(result.rows[0]);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error",
      });

    }
  }
);
router.put(
  "/settings",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        company_name,
        support_email,
        support_phone,
        minimum_deposit,
        minimum_withdrawal,
        daily_profit_rate,
        referral_bonus,
        deposits_enabled,
        withdrawals_enabled,
        maintenance_mode,
        usdt_trc20_wallet,
        usdt_bep20_wallet,
        bitcoin_wallet,
        ethereum_wallet,
      } = req.body;

      const result = await pool.query(
        `
        UPDATE settings
        SET
          company_name = $1,
          support_email = $2,
          support_phone = $3,
          minimum_deposit = $4,
          minimum_withdrawal = $5,
          daily_profit_rate = $6,
          referral_bonus = $7,
          deposits_enabled = $8,
          withdrawals_enabled = $9,
          maintenance_mode = $10,
          usdt_trc20_wallet = $11,
          usdt_bep20_wallet = $12,
          bitcoin_wallet = $13,
          ethereum_wallet = $14
        WHERE id = 1
        RETURNING *
        `,
        [
          company_name,
          support_email,
          support_phone,
          minimum_deposit,
          minimum_withdrawal,
          daily_profit_rate,
          referral_bonus,
          deposits_enabled,
          withdrawals_enabled,
          maintenance_mode,
          usdt_trc20_wallet,
          usdt_bep20_wallet,
          bitcoin_wallet,
          ethereum_wallet,
        ]
      );

      res.json({
        message: "Settings updated successfully",
        settings: result.rows[0],
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);
router.get(
  "/plans",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const result = await pool.query(`
        SELECT *
        FROM investment_plans
        ORDER BY investment_amount ASC
      `);

      res.json(result.rows);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error",
      });

    }

  }
);
router.post(
  "/plans",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const {

        name,
        investment_amount,
        daily_return,
        duration_days,
        total_return,
        badge,
        description,
        status,

      } = req.body;

      const result = await pool.query(
        `
        INSERT INTO investment_plans
        (
          name,
          investment_amount,
          daily_return,
          duration_days,
          total_return,
          badge,
          description,
          status
        )

        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)

        RETURNING *
        `,
        [

          name,
          investment_amount,
          daily_return,
          duration_days,
          total_return,
          badge,
          description,
          status,

        ]
      );

      res.status(201).json(result.rows[0]);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error",
      });

    }

  }
);
router.put(
  "/plans/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const { id } = req.params;

      const {

        name,
        investment_amount,
        daily_return,
        duration_days,
        total_return,
        badge,
        description,
        status,

      } = req.body;

      const result = await pool.query(
        `
        UPDATE investment_plans

        SET

        name=$1,
        investment_amount=$2,
        daily_return=$3,
        duration_days=$4,
        total_return=$5,
        badge=$6,
        description=$7,
        status=$8,
        updated_at=NOW()

        WHERE id=$9

        RETURNING *
        `,
        [

          name,
          investment_amount,
          daily_return,
          duration_days,
          total_return,
          badge,
          description,
          status,
          id,

        ]
      );

      res.json(result.rows[0]);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:"Server error",
      });

    }

  }
);
router.delete(
  "/plans/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const { id } = req.params;

      await pool.query(
        "DELETE FROM investment_plans WHERE id=$1",
        [id]
      );

      res.json({
        message:"Plan deleted successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:"Server error",
      });

    }

  }
);
router.get(
  "/deposits",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          deposits.*,
          users.full_name,
          users.email
        FROM deposits
        JOIN users ON users.id = deposits.user_id
        ORDER BY deposits.created_at DESC
      `);

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/deposits/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const depositResult = await pool.query(
        "SELECT * FROM deposits WHERE id = $1",
        [id]
      );

      if (depositResult.rows.length === 0) {
        return res.status(404).json({ message: "Deposit not found" });
      }

      const deposit = depositResult.rows[0];

      if (deposit.status !== "Pending") {
        return res.status(400).json({
          message: "This deposit has already been processed",
        });
      }

      if (status === "Approved") {
        await pool.query(
          "UPDATE users SET balance = balance + $1 WHERE id = $2",
          [deposit.amount, deposit.user_id]
        );

        await pool.query(
          `
          INSERT INTO wallet_transactions
          (user_id, type, amount, description)
          VALUES ($1, $2, $3, $4)
          `,
          [
            deposit.user_id,
            "deposit",
            deposit.amount,
            `${deposit.network} deposit approved`,
          ]
        ); 
        // Check whether this user was referred
const referralResult = await pool.query(
  `
  SELECT referred_by, referral_rewarded
  FROM users
  WHERE id = $1
  `,
  [deposit.user_id]
);

const referredUser = referralResult.rows[0];

if (
  referredUser &&
  referredUser.referred_by &&
  !referredUser.referral_rewarded
) {
  // Get the referral reward amount from settings
  const settingsResult = await pool.query(
    "SELECT referral_bonus FROM settings LIMIT 1"
  );

  const reward = Number(settingsResult.rows[0].referral_bonus);

  // Credit the referrer's wallet
  await pool.query(
    `
    UPDATE users
    SET
      balance = balance + $1,
      referral_earnings = referral_earnings + $1
    WHERE id = $2
    `,
    [reward, referredUser.referred_by]
  );

  // Record the referral reward transaction
  await pool.query(
    `
    INSERT INTO wallet_transactions
    (user_id, type, amount, description)
    VALUES ($1, $2, $3, $4)
    `,
    [
      referredUser.referred_by,
      "referral",
      reward,
      `Referral reward for user #${deposit.user_id}`,
    ]
  );

  // Prevent paying this referral again
  await pool.query(
    `
    UPDATE users
    SET referral_rewarded = TRUE
    WHERE id = $1
    `,
    [deposit.user_id]
  );
}
      }

      const result = await pool.query(
        `
        UPDATE deposits
        SET
          status = $1,
          approved_by = $2,
          approved_at = NOW()
        WHERE id = $3
        RETURNING *
        `,
        [status, req.user.id, id]
      );

      res.json({
        message: `Deposit ${status}`,
        deposit: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
router.put(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      const result = await pool.query(
        `
        UPDATE users
        SET role = $1
        WHERE id = $2
        RETURNING id, full_name, email, role
        `,
        [role, id]
      );

      res.json({
        message: `User role changed to ${role}`,
        user: result.rows[0],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);
module.exports = router;