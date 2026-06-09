const jwt = require('jsonwebtoken');
const { verifySupabaseToken } = require('../config/supabase');
const { UserModel } = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Intentar con Supabase
    const supabaseUser = await verifySupabaseToken(token);
    if (supabaseUser) {
      let user = await UserModel.findOne({ auth_id: supabaseUser.id });
      if (!user) {
        user = await UserModel.create({
          email: supabaseUser.email,
          auth_provider: 'supabase',
          auth_id: supabaseUser.id,
          plan: 'free'
        });
      }
      req.user = { id: user._id.toString(), email: user.email, plan: user.plan };
      return next();
    }

    // 2. Fallback JWT propio
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(401).json({ success: false, error: 'Auth no disponible' });
    }
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { id: decoded.id, email: decoded.email, plan: decoded.plan };
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }
};

const requirePlan = (plans) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'No autenticado' });
  if (!plans.includes(req.user.plan)) return res.status(403).json({ success: false, error: 'Plan requerido no activo' });
  next();
};

module.exports = { authMiddleware, requirePlan };
