const pool = require("../config/db");

async function listDrivers(req, res) {
  const search = `%${req.query.search || ""}%`;
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT * FROM drivers
     WHERE driver_name LIKE ? OR phone_number LIKE ? OR motorcycle_plate LIKE ? OR national_id LIKE ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [search, search, search, search, limit, offset]
  );
  const [[count]] = await pool.query(
    `SELECT COUNT(*) total FROM drivers
     WHERE driver_name LIKE ? OR phone_number LIKE ? OR motorcycle_plate LIKE ? OR national_id LIKE ?`,
    [search, search, search, search]
  );
  res.json({ data: rows, page, total: count.total, pages: Math.ceil(count.total / limit) });
}

async function getDriver(req, res) {
  const [drivers] = await pool.query("SELECT * FROM drivers WHERE id = ?", [req.params.id]);
  if (!drivers[0]) return res.status(404).json({ message: "Driver not found" });

  const [history] = await pool.query(
    `SELECT ir.*, d.driver_name, d.motorcycle_plate
     FROM income_records ir
     JOIN drivers d ON d.id = ir.driver_id
     WHERE ir.driver_id = ?
     ORDER BY ir.payment_date DESC, ir.payment_time DESC`,
    [req.params.id]
  );
  res.json({ driver: drivers[0], history });
}

async function createDriver(req, res) {
  const { driver_name, phone_number, motorcycle_plate, national_id, address } = req.body;
  const [result] = await pool.query(
    `INSERT INTO drivers (driver_name, phone_number, motorcycle_plate, national_id, address)
     VALUES (?, ?, ?, ?, ?) RETURNING id`,
    [driver_name, phone_number, motorcycle_plate, national_id, address || ""]
  );
  res.status(201).json({ id: result.insertId, message: "Driver added successfully" });
}

async function updateDriver(req, res) {
  const { driver_name, phone_number, motorcycle_plate, national_id, address } = req.body;
  const [result] = await pool.query(
    `UPDATE drivers
     SET driver_name = ?, phone_number = ?, motorcycle_plate = ?, national_id = ?, address = ?
     WHERE id = ?`,
    [driver_name, phone_number, motorcycle_plate, national_id, address || "", req.params.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: "Driver not found" });
  res.json({ message: "Driver updated successfully" });
}

async function deleteDriver(req, res) {
  const [result] = await pool.query("DELETE FROM drivers WHERE id = ?", [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: "Driver not found" });
  res.json({ message: "Driver deleted successfully" });
}

module.exports = { listDrivers, getDriver, createDriver, updateDriver, deleteDriver };
