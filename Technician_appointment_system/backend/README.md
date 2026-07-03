# TAS Backend — Technician Appointment System (API)

Express.js + SQLite REST API for managing technician service appointments.

## Tech Stack
- **Runtime:** Node.js (>= 22.5.0 — uses the built-in `node:sqlite` module, so there's no native dependency to compile)
- **Framework:** Express.js
- **Database:** SQLite (file-based, zero setup)

## Getting Started

```bash
npm install
cp .env.example .env      # adjust PORT / CORS_ORIGIN if needed
npm run seed               # optional: adds 4 sample appointments
npm start                  # starts the API on http://localhost:5000
```

For development with auto-restart on file changes:
```bash
npm run dev
```

## Database

On first run, `src/db/database.js` automatically creates `src/db/tas.sqlite` and
the `technician_appointment` table if they don't already exist — no manual
migration step required.

### Schema
| Field | Type | Notes |
|---|---|---|
| appointment_id | INTEGER | Primary key, auto-increment |
| technician_name | TEXT | Required |
| customer_name | TEXT | Required |
| service_type | TEXT | Required |
| appointment_date | TEXT (DATE) | Required, `YYYY-MM-DD` |
| appointment_time | TEXT (TIME) | Required, `HH:MM` |
| location | TEXT | Required |
| issue_description | TEXT | Optional |
| status | TEXT | One of `Scheduled`, `In Progress`, `Completed`, `Cancelled` (default `Scheduled`) |
| service_charge | REAL | Required, `>= 0` |
| created_at | TEXT (DATETIME) | Auto-set on insert |
| updated_at | TEXT (DATETIME) | Auto-updated via trigger on every update |

> **Design note:** the spec asks for a DB-level CHECK that `appointment_date >= CURRENT_DATE`.
> That's enforced in the validation middleware **on create only**, rather than as a
> SQL `CHECK` constraint, because a `CHECK` re-validates on *every* row update —
> which would make it impossible to update the status of an appointment (e.g. to
> "Completed") once its date has passed. The "not in the past" rule is checked
> where it actually matters: when a new appointment is scheduled.

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/appointments` | List all appointments. Supports `?status=`, `?technician_name=`, `?sort=`, `?order=` |
| GET | `/appointments/:id` | Get a single appointment |
| POST | `/appointments` | Create a new appointment |
| PUT | `/appointments/:id` | Update an existing appointment |
| PATCH | `/appointments/:id/status` | Update only the status (used for quick "Cancel") |
| DELETE | `/appointments/:id` | Delete an appointment |
| GET | `/health` | Health check |

### Example — create an appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "technician_name": "Rahul Verma",
    "customer_name": "Anita Sharma",
    "service_type": "AC Repair",
    "appointment_date": "2026-07-10",
    "appointment_time": "10:30",
    "location": "12 MG Road, Lucknow",
    "issue_description": "AC not cooling",
    "service_charge": 899.00
  }'
```

### Validation
All required-field, type, and range rules described in the project spec are
enforced server-side in `src/middleware/validate.js`, and mirrored client-side
in the frontend form. Invalid requests return `400` with an `errors` array.

## Project Structure
```
backend/
├── src/
│   ├── db/
│   │   ├── database.js     # connection + schema bootstrap
│   │   └── seed.js         # optional sample data
│   ├── controllers/
│   │   └── appointmentController.js
│   ├── middleware/
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── appointments.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: TAS backend"
git branch -M main
git remote add origin <YOUR_NEW_BACKEND_REPO_URL>
git push -u origin main
```

Make sure the repository is **public** and that `node_modules/` and `.env`
are **not** committed — both are already excluded via `.gitignore`.
