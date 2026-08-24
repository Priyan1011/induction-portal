# SCIEnT Inductions Portal — Task 3

A MERN-stack (MongoDB, Express, React, Node.js) implementation of the Inductions Portal
brief, covering the "Basic" requirements of Modules A–F, plus a couple of the
Brownie/Optional items.

## Tech Stack
- **Frontend:** React 18 + React Router + Vite + Axios
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT — one flow for the admin (username/password), one lightweight
  flow for inductees (email + roll number, since the brief never asks
  applicants to set a password)
- **Email:** Nodemailer — logs to the console if no SMTP credentials are set,
  so the whole app is testable without a real mail server

## Features Implemented

| Module | Feature | Status |
|---|---|---|
| A — Application Form | Public form, validation (no duplicate domain, required fields), confirmation email | ✅ Basic |
| A | Domain-specific follow-up questions | ⚠️ Data field exists (`followUpAnswers`), UI not built out |
| B — Admin Dashboard | List/filter by domain + preference rank, view full application | ✅ Basic |
| B | Export filtered list as CSV | ❌ Not implemented (Brownie) |
| C — Domain Access & Task/Q&A | Domain assignment, scoped access, task posting, Q&A thread | ✅ Basic |
| C | @mentions in comments | ❌ Not implemented (Brownie) |
| D — Interview Scheduling | Slot creation, booking with conflict check (slot + own double-booking), reminder email | ✅ Basic |
| D | Cross-panel conflict checking | ❌ Not implemented (Brownie) |
| E — Interview Status Tracking | Status marking (admin-only visibility) | ✅ Basic |
| E | Notes/rating field | ✅ Implemented (Brownie) |
| F — Round Progression | Advance to next round, final selection/rejection with bulk email | ✅ Basic |
| F | Public results page, generalized multi-round support | ⚠️ Round is a free-form number so it already scales; no public results page |

## Project Structure

```
induction-portal/
├── backend/
│   ├── config/db.js
│   ├── models/            Inductee, DomainTask, QnA, InterviewSlot, Interview, Admin
│   ├── middleware/auth.js JWT auth + role guards
│   ├── utils/email.js
│   ├── controllers/
│   ├── routes/
│   ├── scripts/           seedAdmin.js, sendReminders.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── pages/          one file per screen
        └── App.jsx
```

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env      # edit MONGO_URI, JWT_SECRET, ADMIN_PASSWORD, etc.
npm install
node scripts/seedAdmin.js # creates the admin login from your .env
npm run dev                # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # starts on http://localhost:5173
```

You'll need a running MongoDB instance (local `mongod` or a free MongoDB Atlas
cluster) and to point `MONGO_URI` at it.

### 3. Testing the reminder cron without waiting a day
```bash
cd backend
node scripts/sendReminders.js
```

## Assumptions & Limitations
- Inductee "login" is intentionally simple (email + roll number, no password)
  since the brief never specifies applicant accounts — only the admin has
  credentials. Swap for a real OTP/magic-link flow before using with real data.
- Emails print to the console unless SMTP env vars are set.
- CSV export, @mentions, and cross-panelist conflict checking (all marked
  Brownie/Optional in the brief) were left out to focus effort on the Basic
  requirements across every module.
