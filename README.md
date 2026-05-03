# BarberJohn22 Mobile App (Expo / React Native)

Cross-platform iOS + Android app scaffold for booking, Instagram reel discovery, reminders, and loyalty gamification.

## Implemented in this scaffold

- Service catalog for all requested fade/cut types.
- In-app booking form.
- Push notification confirmation and 30-day rebook reminder scheduling.
- Loyalty engine baseline (points + tiers).
- Instagram reel/profile entry points.

## Run locally

```bash
npm install
npm run start
```

## Production integrations to complete

1. **Google Calendar two-way sync**
   - Backend endpoint for OAuth and token refresh.
   - Create/update/delete calendar events on booking changes.
   - Pull busy slots from Google Calendar to block app availability.

2. **Instagram reel ingestion**
   - Use Instagram Graph API with a Business/Creator account.
   - Cache reel metadata server-side and serve to app.

3. **Backend services**
   - Appointments service (CRUD + reminders + anti-double-booking).
   - Loyalty ledger service (events, balances, tier promotions).
   - Notification orchestration (24h, 2h, 30-day cadence).

4. **Operational hardening**
   - Auth, payments/deposits, cancellation policy, analytics, admin dashboard.
