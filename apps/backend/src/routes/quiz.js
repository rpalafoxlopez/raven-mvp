import express from 'express';
import jwt from 'jsonwebtoken';
import QUESTIONS from '../data/questions.js';
import { calcularDiagnostico } from '../services/quizScoring.js';
import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';

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
        await QuizResult.create({ userId, answers, resultado });
        await User.findByIdAndUpdate(userId, {
          archetype: resultado.perfil.dominante ? resultado.perfil.dominante.codigo : null
        });
      } catch (dbErr) {
        console.error('No se pudo guardar el resultado:', dbErr.message);
      }
    }

    return res.json(resultado);
  } catch (err) {
    console.error('Quiz submit error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
