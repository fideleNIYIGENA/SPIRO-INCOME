const pool = require("../config/db");

async function getDashboard(req, res) {
  const [[today]] = await pool.query("SELECT COALESCE(SUM(amount),0) total FROM income_records WHERE payment_date = CURRENT_DATE");
  const [[week]] = await pool.query(
    "SELECT COALESCE(SUM(amount),0) total FROM income_records WHERE DATE_TRUNC('week', payment_date) = DATE_TRUNC('week', CURRENT_DATE)"
  );
  const [[month]] = await pool.query(
    "SELECT COALESCE(SUM(amount),0) total FROM income_records WHERE DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', CURRENT_DATE)"
  );
  const [[drivers]] = await pool.query("SELECT COUNT(*) total FROM drivers");
  const [recent] = await pool.query(
    `SELECT ir.*, d.driver_name, d.motorcycle_plate
     FROM income_records ir JOIN drivers d ON d.id = ir.driver_id
     ORDER BY ir.created_at DESC LIMIT 8`
  );
  const [chart] = await pool.query(
    `SELECT payment_date label, SUM(amount) total
     FROM income_records
     WHERE payment_date >= CURRENT_DATE - INTERVAL '13 days'
     GROUP BY payment_date
     ORDER BY payment_date`
  );

  res.json({
    totals: {
      today: Number(today.total),
      week: Number(week.total),
      month: Number(month.total),
      drivers: Number(drivers.total)
    },
    recent,
    chart
  });
}

module.exports = { getDashboard };
