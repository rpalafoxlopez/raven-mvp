require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const compression = require('compression');
const morgan     = require('morgan');

const { connectDB }    = require('./config/db');
const { apiRateLimit } = require('./middleware/rateLimit.middleware');

const authRoutes   = require('./routes/auth.routes');
const quizRoutes   = require('./routes/quiz.routes');
const aiRoutes     = require('./routes/ai.routes');
const emailRoutes  = require('./routes/email.routes');
const stripeRoutes = require('./routes/stripe.routes');
const userRoutes   = require('./routes/user.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// Seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));

// Stripe webhook necesita raw body ANTES de express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting global
app.use('/api', apiRateLimit);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Rutas
app.use('/api/auth',   authRoutes);
app.use('/api/quiz',   quizRoutes);
app.use('/api/ai',     aiRoutes);
app.use('/api/email',  emailRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/user',   userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint no encontrado' });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Raven API corriendo en puerto ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

module.exports = app;
