const pool = require("../config/db");

function rangeForType(type) {
  if (type === "daily") return ["CURRENT_DATE", "CURRENT_DATE"];
  if (type === "weekly") return ["DATE_TRUNC('week', CURRENT_DATE)::date", "CURRENT_DATE"];
  if (type === "monthly") return ["DATE_TRUNC('month', CURRENT_DATE)::date", "CURRENT_DATE"];
}

async function getReports(req, res) {
  const { type = "daily", startDate, endDate, search = "" } = req.query;
  const like = `%${search}%`;
  let where = "WHERE (d.driver_name LIKE ? OR d.motorcycle_plate LIKE ?)";
  const params = [like, like];

  const preset = rangeForType(type);
  if (type === "custom") {
    where += " AND ir.payment_date BETWEEN ? AND ?";
    params.push(startDate, endDate);
  } else if (preset) {
    where += ` AND ir.payment_date BETWEEN ${preset[0]} AND ${preset[1]}`;
  }

  const [records] = await pool.query(
    `SELECT ir.*, d.driver_name, d.motorcycle_plate, d.phone_number
     FROM income_records ir
     JOIN drivers d ON d.id = ir.driver_id
     ${where}
     ORDER BY ir.payment_date DESC, ir.payment_time DESC`,
    params
  );
  const total = records.reduce((sum, row) => sum + Number(row.amount), 0);
  res.json({ records, total, count: records.length });
}

module.exports = { getReports };
