# 🔐 Vardhaman IT Department - Faculty Login Credentials

> **Confidential Document:** Please distribute these credentials to the respective faculty members securely.

### Login URL
Access the portal at your Vercel deployment URL (e.g., `https://your-app.vercel.app/login`)

### Login Instructions
Faculty can log in using **EITHER** their Vardhaman Mail ID **OR** their VCE ID as the identifier.

| S.No | Name | VCE ID | Mail ID | Password |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Dr. Srinivasulu Gogula (HOD) | VCE1678 | gsrinivasulu1678@vardhaman.org | `hY7@kP2m` |
| 2 | Dr. Muni Sekhar Velpuru | VCE296 | munisek@vardhaman.org | `vQ4#rN9z` |
| 3 | Mr. Vivek Kulkarni | VCE850 | vivek@vardhaman.org | `bX8$wT5c` |
| 4 | Dr Yesubabu Mannava | VCE1320 | mannavababu@vardhaman.org | `mP2*jL8v` |
| 5 | Dr Ganesh Bhaiyya Regulwar | VCE1477 | ganeshregulwar@vardhaman.org | `dR6!kG3x` |
| 6 | Dr B K Madhavi | VCE1593 | madhavi1593@vardhaman.org | `tY9&hB4n` |
| 7 | Dr. K Mamatha | VCE567 | k.mamatha@vardhaman.org | `pC3@fV7m` |
| 8 | Mr. K. Anvesh | VCE652 | anvesh@vardhaman.org | `wN5#sD2j` |
| 9 | Dr. E. Ravi Kumar | VCE865 | ravikumar.e@vardhaman.org | `kL8$gP1x` |
| 10 | Dr K Nikhila | VCE1168 | nikhila@vardhaman.org | `jF4*vB9c` |
| 11 | Ms P Swetha | VCE1343 | swethabharath27@vardhaman.org | `xT7!mN6v` |
| 12 | Ms Farhana Begum | VCE1346 | farhanasattar@vardhaman.org | `gR2&pL5b` |
| 13 | Mr K Venkatesh | VCE828 | venkateshkavididevi@vardhaman.org | `cM9@wH3z` |
| 14 | Mrs Yadla Sunanda | VCE1380 | sunanda@vardhaman.org | `nK5#dF8x` |
| 15 | Ms B Swapna | VCE1409 | swapna_vce1409@vardhaman.org | `vJ3$bT7m` |
| 16 | Mr K Santosh Kumar | VCE1412 | santoshkumar@vardhaman.org | `zP8*cG2n` |
| 17 | Mr S Satheesh Kumar | VCE1453 | satheeshkumar.s@vardhaman.org | `lH6!vN4b` |
| 18 | Ms Ch Dhanalaxmi | VCE1514 | dhanalaxmi1514@vardhaman.org | `qW2&fX9c` |
| 19 | Ms Asma Begum | VCE1512 | asma1512@vardhaman.org | `sD7@jM1v` |
| 20 | Mr S Ranjith Reddy | VCE1086 | ranjithreddy1086@vardhaman.org | `rB4#wL6x` |
| 21 | Ms A Rajitha | VCE1259 | rajitha222@vardhaman.org | `fN9$hP3m` |
| 22 | Mr. Nirmal Keshari Swain | VCE1541 | nirmal1514@vardhaman.org | `yT5*cK8z` |
| 23 | Dr. L. Sunitha | VCE1553 | sunitha1553@vardhaman.org | `mG2!vD7n` |
| 24 | Dr. Vinayak G Biradar | VCE1116 | vinayak1116@vardhaman.org | `pX8&bF5b` |
| 25 | Mr M Yugandhar | VCE1567 | yugandhar1567@vardhaman.org | `kC3@nJ9c` |
| 26 | Mr Mohd Salahuddin | VCE1628 | salahuddin@vardhaman.org | `wV7#sH2x` |
| 27 | Ms Swati Singh | VCE1693 | swatisingh1693@vardhaman.org | `dM4$gW6m` |
| 28 | Ms T Prashanthi | VCE1711 | prashanthi1711@vardhaman.org | `hL9*xP1v` |
| 29 | Ms Sumaiya SK | VCE1732 | sumaiya1732@vardhaman.org | `bN5!cT8z` |
| 30 | Mr. P Vijaya Raghavulu | VCE1768 | raghavulu1768@vardhaman.org | `jF2&vK7b` |
| 31 | Mr Shobanbabu R J | VCE1818 | shobanbabu1818@vardhaman.org | `tD8@mR3c` |
| 32 | Dr Sameera Khan | VCE1865 | sameera1865@vardhaman.org | `pW4#hL5x` |
| 33 | Ms. C Vineela | VCE1858 | vineela1858@vardhaman.org | `vC9$bN2m` |
| 34 | Ms. Shruti S Soma | VCE1911 | shruti1911@vardhaman.org | `fX3*gP6n` |

---
## 🚀 Production Deployment Guide

Since you are transitioning to a full working application for the entire department, follow these exact steps to deploy to Vercel with a permanent online database.

### Step 1: Create a PostgreSQL Database
Because Vercel is a serverless environment, local SQLite databases get deleted frequently. You must use a cloud database.
1. Go to [Neon.tech](https://neon.tech/) or [Supabase](https://supabase.com/) and create a free account.
2. Create a new project/database.
3. Copy the **Connection String (Database URL)** provided by the platform (e.g., `postgresql://user:password@hostname/dbname`).

### Step 2: Update Your Code
1. Open `prisma/schema.prisma`.
2. Change the provider from `"sqlite"` to `"postgresql"`.
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Open your `.env` file and update the `DATABASE_URL`:
   ```env
   DATABASE_URL="your-new-neon-or-supabase-url"
   ```

### Step 3: Push the Schema & Seed Data
Run these commands in your local terminal to push the tables to the new online database and fill it with the faculty data:
```bash
npx prisma db push
node prisma/seed.js
```

### Step 4: Deploy to Vercel
1. Go to your Vercel Dashboard and select your project.
2. Go to **Settings > Environment Variables**.
3. Add the following variables:
   - `DATABASE_URL`: (Your new online database URL)
   - `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`: (For email notifications)
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: (For SMS/WhatsApp)
4. Trigger a new deployment!

The application is now production-ready, secure, and permanent!
