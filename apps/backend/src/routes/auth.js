import express from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import User from '../models/User.js';

const router = express.Router();

// Lazy init — se crea solo cuando llega el primer request, no al cargar el módulo
const getSupabase = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/auth/verify — Supabase token → JWT propio
router.post('/verify', async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) return res.status(400).json({ error: 'access_token requerido' });

    const { data: { user }, error } = await getSupabase().auth.getUser(access_token);
    if (error || !user) return res.status(401).json({ error: 'Token inválido' });

    let dbUser = await User.findOne({ supabaseId: user.id });
    if (!dbUser) {
      dbUser = await User.create({
        supabaseId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        avatar: user.user_metadata?.avatar_url
      });
    }

    const token = jwt.sign(
      { userId: dbUser._id, supabaseId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: dbUser._id,
        email: dbUser.email,
        name: dbUser.name,
        avatar: dbUser.avatar,
        archetype: dbUser.archetype,
        plan: dbUser.plan
      }
    });
  } catch (err) {
    console.error('Auth verify error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      archetype: user.archetype,
      pillars: user.pillars,
      plan: user.plan
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
