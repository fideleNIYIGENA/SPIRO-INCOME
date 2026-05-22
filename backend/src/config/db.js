const { Pool } = require("pg");
require("dotenv").config();

const connectionString =
  process.env.DATABASE_URL ||
  (() => {
    const user = process.env.DB_USER || "postgres";
    const password = process.env.DB_PASSWORD || "";
    const host = process.env.DB_HOST || "localhost";
    const port = Number(process.env.DB_PORT || 5432);
    const database = process.env.DB_NAME || "moto_income";
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
  })();

const isProduction = process.env.NODE_ENV === "production";
const requiresSsl = connectionString.includes("sslmode=require") || connectionString.includes("neon.tech");

const pool = new Pool({
  connectionString,
  ssl: isProduction || requiresSsl ? { rejectUnauthorized: false } : false
});

function translateSql(text) {
  let index = 0;
  return text.replace(/\?/g, () => `$${++index}`);
}

async function query(text, params = []) {
  const sql = translateSql(text);
  const result = await pool.query(sql, params);
  if (result.command === "SELECT") {
    return [result.rows, result];
  }
  return [
    {
      rows: result.rows,
      insertId: result.rows?.[0]?.id ?? null,
      affectedRows: result.rowCount
    },
    result
  ];
}

module.exports = { query, pool };
