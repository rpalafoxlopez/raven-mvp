// dotenv PRIMERO, antes de cualquier import que lea process.env
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

// Fail fast si faltan variables criticas
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI no definida'); process.exit(1); }
if (!process.env.JWT_SECRET)  { console.error('JWT_SECRET no definida');  process.exit(1); }

const app    = express();
const server = createServer(app);

// Whitelist de origenes permitidos
const allowedOrigins = [
  'https://rockyourself.org',
  'https://www.rockyourself.org',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://rockyourself-eu5ejgxo4-rpalafoxlopezs-projects.vercel.app/',
   /^https:\/\/raven-mvp-.*-rpalafoxlopez\.vercel\.app$/
];

// Si FRONTEND_URL esta definida y no esta ya en la lista, la agregamos
if (process.env.FRONTEND_URL && allowedOrigins.indexOf(process.env.FRONTEND_URL) === -1) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptionsDelegate = function (origin, callback) {
  // Permite requests sin origin (apps moviles, curl, Postman, health checks)
  if (!origin) return callback(null, true);
  if (allowedOrigins.indexOf(origin) === -1) {
    return callback(new Error('CORS policy: Origin not allowed'), false);
  }
  return callback(null, true);
};

const io = new Server(server, {
  cors: {
    origin: corsOptionsDelegate,
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: corsOptionsDelegate,
  credentials: true
}));

// Stripe webhook necesita raw body, antes de express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(function () { console.log('MongoDB connected'); })
  .catch(function (err) { console.error('MongoDB error:', err); process.exit(1); });

// Rutas
app.use('/api/auth',     authRoutes);
app.use('/api/quiz',     quizRoutes);
app.use('/api/results',  resultsRoutes);
app.use('/api/coaching', coachingRoutes);
app.use('/api/stripe',   stripeRoutes);

// Health check
app.get('/health', function (req, res) {
  res.json({ status: 'ok', service: 'raven-backend' });
});

// Error handler global
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

setupCoachingSocket(io);

server.listen(PORT, function () {
  console.log('Raven backend running on port ' + PORT);
});

export { io };