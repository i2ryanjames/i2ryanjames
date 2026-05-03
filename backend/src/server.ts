import cors from 'cors';
import dayjs from 'dayjs';
import express from 'express';
import cron from 'node-cron';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json());

const services = [
  'Skin Fade / Bald Fade','Shadow Fade','Razor Fade','Drop Fade','Burst Fade','Temp / Temple Fade','Taper Fade','Afro Fade','High Top Fade'
];

type Appointment = { id: string; clientName: string; service: string; startAt: string; phone?: string; pointsAwarded: number; reminded30d?: boolean };
const appointments: Appointment[] = [];
const loyalty: Record<string, { points: number; streak: number; lastVisit?: string }> = {};

const bookingSchema = z.object({
  clientName: z.string().min(2),
  service: z.string(),
  startAt: z.string(),
  phone: z.string().optional()
});

app.get('/health', (_req, res) => res.json({ ok: true, now: new Date().toISOString() }));
app.get('/services', (_req, res) => res.json({ services }));
app.get('/reels', (_req, res) => res.json({
  username: 'barberjohn22',
  reels: [
    { title: 'Burst fade transformation', url: 'https://www.instagram.com/barberjohn22/reels/' },
    { title: 'High top fade detail', url: 'https://www.instagram.com/barberjohn22/' }
  ]
}));

app.post('/appointments', (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const id = crypto.randomUUID();
  const pointsAwarded = 450;
  const appt: Appointment = { id, ...parsed.data, pointsAwarded };
  appointments.push(appt);

  const key = parsed.data.phone ?? parsed.data.clientName.toLowerCase();
  loyalty[key] = loyalty[key] ?? { points: 0, streak: 0 };
  loyalty[key].points += pointsAwarded;
  loyalty[key].lastVisit = parsed.data.startAt;

  res.status(201).json({ appointment: appt, loyalty: loyalty[key], calendarSync: 'queued' });
});

app.get('/appointments', (_req, res) => res.json({ appointments }));
app.get('/loyalty/:key', (req, res) => res.json(loyalty[req.params.key] ?? { points: 0, streak: 0 }));

// TODO wire Google OAuth + Calendar API; endpoint scaffold exists now.
app.post('/integrations/google-calendar/sync', (_req, res) => {
  res.json({ status: 'queued', note: 'Implement OAuth token storage and Google Calendar API write/read in production.' });
});

cron.schedule('0 12 * * *', () => {
  const now = dayjs();
  appointments.forEach((a) => {
    if (a.reminded30d) return;
    const days = now.diff(dayjs(a.startAt), 'day');
    if (days >= 30) {
      a.reminded30d = true;
      console.log(`30-day reminder => ${a.clientName} (${a.id})`);
    }
  });
});

app.listen(8080, () => console.log('API running on :8080'));
