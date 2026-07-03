# TAS Frontend — Technician Appointment System (UI)

React.js dashboard for managing technician service appointments, built with Vite.

## Tech Stack
- React 18
- Vite
- Plain CSS (no UI framework) — design system in `src/styles/index.css`

## Getting Started

```bash
npm install
cp .env.example .env       # point VITE_API_BASE_URL at your backend if not localhost:5000
npm run dev                 # starts on http://localhost:5173
```

Make sure the **backend** (see the companion `tas-backend` repo) is running
first — the app fetches all data from it.

## Build for production
```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Features

- **Dashboard table** listing all technician appointments, with a live-computed
  **"Days Until Appointment"** column (calculated in the browser at render
  time from `appointment_date` — never stored in the database).
- **Add / Edit modals** with full client-side validation matching the backend
  rules (required fields, no past dates on create, non-negative service charge).
- **Delete / Cancel confirmation modals** before any destructive action.
- **Toast notifications** for every create, update, delete, and cancel action.
- **Filtering** by status and searching by technician name.
- Responsive layout — the table collapses into stacked cards on small screens.

## Project Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── appointments.js     # fetch wrapper for all API calls
│   ├── components/
│   │   ├── AppointmentTable.jsx
│   │   ├── AppointmentFormModal.jsx
│   │   ├── ConfirmModal.jsx
│   │   └── ToastContext.jsx
│   ├── utils/
│   │   └── dateUtils.js        # "days until", formatting helpers
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── .env.example
└── package.json
```

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: TAS frontend"
git branch -M main
git remote add origin <YOUR_NEW_FRONTEND_REPO_URL>
git push -u origin main
```

Make sure the repository is **public** and that `node_modules/` and `dist/`
are **not** committed — both are already excluded via `.gitignore`.
