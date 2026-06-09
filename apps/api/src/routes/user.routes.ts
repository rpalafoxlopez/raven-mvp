import { Router } from 'express';
import { UserModel } from '../models/User';
import { QuizResultModel } from '../models/QuizResult';
import { AIPlanModel } from '../models/AIPlan';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/user/profile — Perfil del usuario
router.get('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await UserModel.findById(req.user!.id).select('-__v');
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    return res.json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/user/stats — Estadísticas del usuario
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const [quizCount, planCount] = await Promise.all([
      QuizResultModel.countDocuments({ user_id: req.user!.id }),
      AIPlanModel.countDocuments({ user_id: req.user!.id })
    ]);

    const latestQuiz = await QuizResultModel.findOne({ user_id: req.user!.id })
      .sort({ created_at: -1 })
      .select('diagnostico created_at');

    return res.json({
      success: true,
      data: {
        quizzesCompleted: quizCount,
        setlistsGenerated: planCount,
        latestDiagnosis: latestQuiz?.diagnostico || null,
        plan: req.user!.plan
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
