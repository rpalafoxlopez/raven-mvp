const express = require('express');
const jwt = require('jsonwebtoken');
const QUESTIONS = require('../data/questions');
const { calcularDiagnostico } = require('../services/quizScoring');

const router = express.Router();

router.get('/questions', function (req, res) {
  res.json(QUESTIONS);
});

router.post('/submit', async function (req, res) {
  try {
    const answers = req.body.answers;
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers requerido' });
    }

    const resultado = calcularDiagnostico(answers);

    // Auth opcional: si hay token valido, intentamos guardar el resultado
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.indexOf('Bearer ') === 0) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (e) {
        // token invalido, continuar como anonimo
      }
    }

    if (userId) {
      try {
        const QuizResult = require('../models/QuizResult');
        const User = require('../models/User');
        await QuizResult.create({ userId, answers, resultado });
        await User.findByIdAndUpdate(userId, {
          archetype: resultado.perfil.dominante ? resultado.perfil.dominante.codigo : null
        });
      } catch (dbErr) {
        console.error('No se pudo guardar el resultado:', dbErr.message);
        // No bloqueamos la respuesta al usuario por un fallo de guardado
      }
    }

    return res.json(resultado);
  } catch (err) {
    console.error('Quiz submit error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
