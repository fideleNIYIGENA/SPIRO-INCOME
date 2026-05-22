const pool = require("../config/db");

async function listIncome(req, res) {
  const search = `%${req.query.search || ""}%`;
  const date = req.query.date;
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
  const offset = (page - 1) * limit;
  const dateFilter = date ? "AND ir.payment_date = ?" : "";
  const params = date ? [search, search, date, limit, offset] : [search, search, limit, offset];

  const [rows] = await pool.query(
    `SELECT ir.*, d.driver_name, d.motorcycle_plate
     FROM income_records ir
     JOIN drivers d ON d.id = ir.driver_id
     WHERE (d.driver_name LIKE ? OR d.motorcycle_plate LIKE ?) ${dateFilter}
     ORDER BY ir.payment_date DESC, ir.payment_time DESC
     LIMIT ? OFFSET ?`,
    params
  );

  const countParams = date ? [search, search, date] : [search, search];
  const [[count]] = await pool.query(
    `SELECT COUNT(*) total
     FROM income_records ir
     JOIN drivers d ON d.id = ir.driver_id
     WHERE (d.driver_name LIKE ? OR d.motorcycle_plate LIKE ?) ${dateFilter}`,
    countParams
  );
  res.json({ data: rows, page, total: count.total, pages: Math.ceil(count.total / limit) });
}

async function createIncome(req, res) {
  const { driver_id, driver_name, amount, notes, payment_date, payment_time } = req.body;
  let id = driver_id;

  if (!id && driver_name) {
    const [drivers] = await pool.query("SELECT id FROM drivers WHERE driver_name = ? LIMIT 1", [driver_name]);
    id = drivers[0]?.id;
  }
  if (!id) return res.status(422).json({ message: "Select an existing driver or enter an exact driver name" });

  const [result] = await pool.query(
    `INSERT INTO income_records (driver_id, amount, notes, payment_date, payment_time)
     VALUES (?, ?, ?, COALESCE(?, CURRENT_DATE), COALESCE(?, CURRENT_TIME)) RETURNING id`,
    [id, amount, notes || "", payment_date || null, payment_time || null]
  );
  res.status(201).json({ id: result.insertId, message: "Income recorded successfully" });
}

async function updateIncome(req, res) {
  const { driver_id, amount, notes, payment_date, payment_time } = req.body;
  const [result] = await pool.query(
    `UPDATE income_records
     SET driver_id = ?, amount = ?, notes = ?, payment_date = ?, payment_time = ?
     WHERE id = ?`,
    [driver_id, amount, notes || "", payment_date, payment_time, req.params.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: "Income record not found" });
  res.json({ message: "Income record updated successfully" });
}

async function deleteIncome(req, res) {
  const [result] = await pool.query("DELETE FROM income_records WHERE id = ?", [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: "Income record not found" });
  res.json({ message: "Income record deleted successfully" });
}

module.exports = { listIncome, createIncome, updateIncome, deleteIncome };
