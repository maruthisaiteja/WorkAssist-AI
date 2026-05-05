# HOD Task Management & Alert System
## Department of Information Technology, Vardhaman College of Engineering

A comprehensive web-based application for the Head of Department (HOD) to assign tasks, track real-time status, and manage automated alerts for faculty members.

### 🎯 Key Features
- **HOD Dashboard**: Real-time tracking of tasks with status badges and filters.
- **Task Assignment**: Assign tasks to multiple faculty members with priority, category, and deadlines.
- **Automated Alerts**: Email, SMS, and WhatsApp alerts sent immediately and as reminders (4h, 2h, 1h before deadline).
- **Faculty Portal**: Personal task views for faculty to acknowledge and complete assignments.
- **In-App Notifications**: Real-time popups and activity logs for both HOD and Faculty.
- **Premium UI**: Modern, responsive design built with Next.js, Tailwind CSS, and Framer Motion.

### 🛠️ Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js API Routes (Node.js).
- **Database**: SQLite (local) with Prisma ORM.
- **Authentication**: JWT with Role-Based Access Control.
- **Scheduler**: Node-cron for background reminder processing.

### 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   ```bash
   npx prisma migrate dev --name init
   npx node prisma/seed.js
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in your SMTP and Twilio credentials.

4. **Run Locally**:
   ```bash
   npm run dev
   ```

### 👤 Login Credentials
- **HOD Login**: `hod.it@vardhaman.org`
- **Faculty Login**: Check the `prisma/seed.js` for generated emails (e.g., `muni.sekhar.velpuru@vardhaman.org`)
- **Password**: `Vardhaman@123` (Same for all during development)

### 📁 Directory Structure
- `src/app`: Application pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Core utilities (Auth, Prisma).
- `src/utils`: Helper functions and background scheduler.
- `prisma`: Database schema and seeding scripts.

---
**Institution**: Vardhaman College of Engineering, Hyderabad
**HOD**: Dr. Sreenivasulu Gogula
**Department**: Information Technology
