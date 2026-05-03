# BarberJohn22 Full App (iOS + Android + API)

This repository now contains:
- `mobile/` Expo React Native customer app
- `backend/` Express API for booking, loyalty, reels feed, and reminder scheduling scaffold

## Features implemented
- Fade/cut catalog
- Appointment booking through API
- Loyalty points/tier tracking
- Push confirmation notification
- 30-day reminder scheduler (server cron scaffold)
- Instagram reel links/feed endpoint
- Google Calendar sync endpoint scaffold

## Run backend
```bash
cd backend
npm install
npm run dev
```

## Run mobile
```bash
cd mobile
npm install
npm run start
```

## Production completion checklist
1. Replace in-memory arrays with PostgreSQL.
2. Implement Google OAuth token storage + Calendar API read/write.
3. Integrate Instagram Graph API for real reel ingestion.
4. Add auth, payments/deposits, and admin dashboard.
5. Configure push pipelines: APNs/FCM + job queue.
