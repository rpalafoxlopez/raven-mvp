import { Router } from 'express';
import { QuizResultModel } from '../models/QuizResult';
import { calcularDiagnostico, mapearPerfilRockstar } from '../services/quizScoring.service';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { quizRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// POST /api/quiz/submit — Enviar respuestas y obtener diagnóstico
router.post('/submit', quizRateLimit, async (req, res) => {
  try {
    const rawData = req.body;

    // Validación básica
    if (!rawData.fase_0 || !rawData.fase_1 || !rawData.fase_2 || !rawData.filtros) {
      return res.status(400).json({
        success: false,
        error: 'Datos incompletos. Se requieren fase_0, fase_1, fase_2 y filtros.'
      });
    }

    // Calcular diagnóstico
    const diagnostico = calcularDiagnostico(rawData);
    const perfil = mapearPerfilRockstar(diagnostico);

    // Si hay usuario autenticado, guardar en DB
    const userId = (req as any).user?.id;
    if (userId) {
      await QuizResultModel.create({
        user_id: userId,
        raw_data: rawData,
        diagnostico,
        perfil_rockstar: {
          dominante: perfil.dominante.pilar,
          secundario: perfil.secundario.pilar,
          terciario: perfil.terciario?.pilar || perfil.secundario.pilar,
          bloqueado: perfil.bloqueado?.pilar || null
        }
      });
    }

    return res.json({
      success: true,
      data: {
        diagnostico,
        perfil,
        raw: rawData
      }
    });
  } catch (error: any) {
    console.error('Error en quiz submit:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/quiz/history — Historial de evaluaciones (requiere auth)
router.get('/history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const results = await QuizResultModel.find({ user_id: req.user!.id })
      .sort({ created_at: -1 })
      .limit(10);

    return res.json({ success: true, data: results });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/quiz/result/:id — Obtener resultado específico
router.get('/result/:id', async (req, res) => {
  try {
    const result = await QuizResultModel.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Resultado no encontrado' });
    }
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
