const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const pool = require("../config/db");
const { isAllowedAdmin } = require("../utils/allowedAdmins");

function signToken(admin) {
  return jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";
  if (!isAllowedAdmin(email)) return res.status(403).json({ message: "Only authorized admins can login" });

  const [rows] = await pool.query("SELECT * FROM admins WHERE email = ?", [email]);
  const admin = rows[0];
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: signToken(admin),
    admin: { id: admin.id, email: admin.email, created_at: admin.created_at }
  });
}

async function me(req, res) {
  res.json({ admin: req.admin });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const [rows] = await pool.query("SELECT * FROM admins WHERE id = ?", [req.admin.id]);
  const admin = rows[0];
  if (!(await bcrypt.compare(currentPassword, admin.password))) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  const hashed = await bcrypt.hash(newPassword, 12);
  await pool.query("UPDATE admins SET password = ? WHERE id = ?", [hashed, req.admin.id]);
  res.json({ message: "Password changed successfully" });
}

async function forgotPassword(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!isAllowedAdmin(email)) return res.status(403).json({ message: "Email is not authorized" });

  const [rows] = await pool.query("SELECT id, email FROM admins WHERE email = ?", [email]);
  const admin = rows[0];
  if (!admin) return res.status(404).json({ message: "Admin account not found. Run backend setup first." });

  const token = randomUUID();
  await pool.query(
    "INSERT INTO password_reset_tokens (admin_id, token, expires_at) VALUES (?, ?, NOW() + INTERVAL '30 minutes')",
    [admin.id, token]
  );

  res.json({
    message: "Reset token generated. In production, send this token by email.",
    resetToken: token
  });
}

async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  const [rows] = await pool.query(
    `SELECT prt.*, a.email
     FROM password_reset_tokens prt
     JOIN admins a ON a.id = prt.admin_id
     WHERE prt.token = ? AND prt.used_at IS NULL AND prt.expires_at > NOW()`,
    [token]
  );
  const reset = rows[0];
  if (!reset || !isAllowedAdmin(reset.email)) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await pool.query("UPDATE admins SET password = ? WHERE id = ?", [hashed, reset.admin_id]);
  await pool.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [reset.id]);
  res.json({ message: "Password reset successfully" });
}

module.exports = { login, me, changePassword, forgotPassword, resetPassword };
