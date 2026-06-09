const rateLimit = require('express-rate-limit');

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Demasiadas peticiones, intenta en 15 minutos' }
});

const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, error: 'Límite de IA alcanzado, espera un minuto' }
});

const quizRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, error: 'Límite de quiz alcanzado' }
});

module.exports = { apiRateLimit, aiRateLimit, quizRateLimit };
