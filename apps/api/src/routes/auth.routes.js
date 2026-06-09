const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/User');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

// POST /api/auth/callback
router.post('/callback', async (req, res) => {
  try {
    const { user } = req.body;
    if (!user?.id || !user?.email) {
      return res.status(400).json({ success: false, error: 'Datos de usuario incompletos' });
    }

    let dbUser = await UserModel.findOne({ auth_id: user.id });
    if (!dbUser) {
      dbUser = await UserModel.create({
        email: user.email,
        nombre: user.user_metadata?.name || user.email.split('@')[0],
        avatar: user.user_metadata?.avatar_url,
        auth_provider: user.app_metadata?.provider || 'supabase',
        auth_id: user.id,
        plan: 'free'
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET no configurado');

    const token = jwt.sign(
      { id: dbUser._id.toString(), email: dbUser.email, plan: dbUser.plan },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: { id: dbUser._id, email: dbUser.email, nombre: dbUser.nombre, avatar: dbUser.avatar, plan: dbUser.plan }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  return res.json({ success: true, data: req.user });
});

module.exports = router;
