const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const { allowedAdmins } = require("./allowedAdmins");

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email VARCHAR(120) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id SERIAL PRIMARY KEY,
      driver_name VARCHAR(120) NOT NULL,
      phone_number VARCHAR(40) NOT NULL,
      motorcycle_plate VARCHAR(40) NOT NULL UNIQUE,
      national_id VARCHAR(80) NOT NULL UNIQUE,
      address VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS income_records (
      id SERIAL PRIMARY KEY,
      driver_id INT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      notes TEXT,
      payment_date DATE NOT NULL,
      payment_time TIME NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_income_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      admin_id INT NOT NULL,
      token VARCHAR(100) NOT NULL UNIQUE,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      used_at TIMESTAMP WITH TIME ZONE NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_reset_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );
  `);

  const hashed = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || "Spiro@2026", 12);
  for (const email of allowedAdmins) {
    await pool.query(
      `INSERT INTO admins (email, password)
       VALUES (?, ?)
       ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password`,
      [email, hashed]
    );
  }

  console.log("Moto Income database is ready. Admin accounts were inserted if missing.");
}

if (require.main === module) {
  initializeDatabase().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { initializeDatabase };
