const { Router } = require('express');
const { UserModel } = require('../models/User');
const { QuizResultModel } = require('../models/QuizResult');
const { AIPlanModel } = require('../models/AIPlan');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-__v');
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/user/stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [quizCount, planCount, latestQuiz] = await Promise.all([
      QuizResultModel.countDocuments({ user_id: req.user.id }),
      AIPlanModel.countDocuments({ user_id: req.user.id }),
      QuizResultModel.findOne({ user_id: req.user.id }).sort({ created_at: -1 }).select('diagnostico created_at')
    ]);

    return res.json({
      success: true,
      data: {
        quizzesCompleted:  quizCount,
        setlistsGenerated: planCount,
        latestDiagnosis:   latestQuiz?.diagnostico || null,
        plan:              req.user.plan
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
