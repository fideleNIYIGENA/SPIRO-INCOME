# Moto Income

Moto Income is a full-stack admin dashboard for recording daily motorcycle income collections. It includes JWT login for exactly two authorized admins, bcrypt password hashing, driver management, income records, reports, PDF/Excel export, and a modern animated React dashboard.

## Authorized Admins

- `niyigenafidele84@gmail.com`
- `julesjulesce@gmail.com`

Default password for both accounts:

```text
Spiro@2026
```

## Project Structure

```text
Moto Income
├── backend
│   └── src
│       ├── config
│       ├── controllers
│       ├── middleware
│       ├── routes
│       └── utils
├── database
│   ├── schema.sql
│   └── sample_data.sql
└── frontend
    └── src
        ├── api
        ├── components
        ├── context
        ├── pages
        └── utils
```

## Requirements

- Node.js 18+
- MySQL 8+
- npm

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run setup
npm run dev
```

Edit `backend/.env` if your MySQL username, password, host, or port is different.

`npm run setup` creates the `moto_income` database, all required tables, the password reset token table, and inserts the two authorized admin accounts.

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit:

```text
http://127.0.0.1:5173
```

## Optional Sample Data

After running backend setup, you can insert sample drivers and income records:

```bash
mysql -u root -p moto_income < database/sample_data.sql
```

Run that command from the project root. If your MySQL user has no password, remove `-p`.

## API Routes

Auth:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/change-password`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Drivers:

- `GET /api/drivers`
- `GET /api/drivers/:id`
- `POST /api/drivers`
- `PUT /api/drivers/:id`
- `DELETE /api/drivers/:id`

Income:

- `GET /api/income`
- `POST /api/income`
- `PUT /api/income/:id`
- `DELETE /api/income/:id`

Dashboard and reports:

- `GET /api/dashboard`
- `GET /api/reports?type=daily`
- `GET /api/reports?type=weekly`
- `GET /api/reports?type=monthly`
- `GET /api/reports?type=custom&startDate=2026-05-01&endDate=2026-05-10`

## Notes

- The forgot password endpoint returns a reset token in the response for beginner-friendly local development. In production, send that token by email instead.
- All protected API routes require `Authorization: Bearer <token>`.
- Passwords are hashed with bcrypt.
- Only the two configured Gmail addresses can login.
