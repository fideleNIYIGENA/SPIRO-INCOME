const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { isAllowedAdmin } = require("../utils/allowedAdmins");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const [rows] = await pool.query("SELECT id, email, created_at FROM admins WHERE id = ?", [decoded.id]);
    const admin = rows[0];
    if (!admin || !isAllowedAdmin(admin.email)) {
      return res.status(403).json({ message: "This admin is not authorized" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { protect };
