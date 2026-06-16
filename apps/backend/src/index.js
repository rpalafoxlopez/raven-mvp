// dotenv PRIMERO — antes de cualquier import que lea process.env
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import authRoutes     from './routes/auth.js';
import quizRoutes     from './routes/quiz.js';
import resultsRoutes  from './routes/results.js';
import coachingRoutes from './routes/coaching.js';
import stripeRoutes   from './routes/stripe.js';
import { setupCoachingSocket } from './socket/coachingSocket.js';

// Fail fast si faltan variables críticas
if (!process.env.MONGODB_URI) { console.error('❌ MONGODB_URI no definida'); process.exit(1); }
if (!process.env.JWT_SECRET)  { console.error('❌ JWT_SECRET no definida');  process.exit(1); }


const app    = express();
const server = createServer(app);
const io     = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const allowedOrigins = [
  'https://rockyourself.org',
  'https://www.rockyourself.org',
  'http://localhost:5173',
  'http://localhost:4173'
];

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Stripe webhook necesita raw body — ANTES de express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });

// Rutas
app.use('/api/auth',     authRoutes);
app.use('/api/quiz',     quizRoutes);
app.use('/api/results',  resultsRoutes);
app.use('/api/coaching', coachingRoutes);
app.use('/api/stripe',   stripeRoutes);   // ← estaba faltando

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'raven-backend' }));

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

setupCoachingSocket(io);

server.listen(PORT, () => {
  console.log(`🎸 Raven backend running on port ${PORT}`);
});

export { io };
