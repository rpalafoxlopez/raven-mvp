import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import resultsRoutes from './routes/results.js';
import coachingRoutes from './routes/coaching.js';
import { setupCoachingSocket } from './socket/coachingSocket.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/coaching', coachingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'raven-backend' });
});

// Socket.io setup
setupCoachingSocket(io);

server.listen(PORT, () => {
  console.log(`🎸 Raven backend running on port ${PORT}`);
});

export { io };