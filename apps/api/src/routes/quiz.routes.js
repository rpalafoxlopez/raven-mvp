const { Router } = require('express');
const { QuizResultModel } = require('../models/QuizResult');
const { calcularDiagnostico, mapearPerfilRockstar } = require('../services/quizScoring.service');
const { authMiddleware } = require('../middleware/auth.middleware');
const { quizRateLimit } = require('../middleware/rateLimit.middleware');

const router = Router();

// POST /api/quiz/submit
router.post('/submit', quizRateLimit, async (req, res) => {
  try {
    const rawData = req.body;
    if (!rawData.fase_0 || !rawData.fase_1 || !rawData.fase_2 || !rawData.filtros) {
      return res.status(400).json({ success: false, error: 'Datos incompletos: fase_0, fase_1, fase_2 y filtros requeridos.' });
    }

    const diagnostico = calcularDiagnostico(rawData);
    const perfil = mapearPerfilRockstar(diagnostico);

    const userId = req.user?.id;
    if (userId) {
      await QuizResultModel.create({
        user_id: userId,
        raw_data: rawData,
        diagnostico,
        perfil_rockstar: {
          dominante:  perfil.dominante.pilar,
          secundario: perfil.secundario.pilar,
          terciario:  perfil.terciario?.pilar || perfil.secundario.pilar,
          bloqueado:  perfil.bloqueado?.pilar || null
        }
      });
    }

    return res.json({ success: true, data: { diagnostico, perfil, raw: rawData } });
  } catch (err) {
    console.error('Error quiz submit:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/quiz/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const results = await QuizResultModel.find({ user_id: req.user.id }).sort({ created_at: -1 }).limit(10);
    return res.json({ success: true, data: results });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/quiz/result/:id
router.get('/result/:id', async (req, res) => {
  try {
    const result = await QuizResultModel.findById(req.params.id);
    if (!result) return res.status(404).json({ success: false, error: 'Resultado no encontrado' });
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
