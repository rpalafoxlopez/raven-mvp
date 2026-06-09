import { Router } from 'express';
import { UserModel } from '../models/User';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/callback — Recibe token de Supabase y crea/actualiza usuario
router.post('/callback', async (req, res) => {
  try {
    const { access_token, refresh_token, user } = req.body;

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
    } else {
      dbUser.updated_at = new Date();
      await dbUser.save();
    }

       // FIX: Verificar que JWT_SECRET existe y usar dbUser._id en vez de user._id
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está configurado');
    }

    
    // Generar JWT propio para el frontend
    const token = jwt.sign(
       { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,  // <-- cast explícito
        { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: dbUser._id,
          email: dbUser.email,
          nombre: dbUser.nombre,
          avatar: dbUser.avatar,
          plan: dbUser.plan
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/me — Obtener usuario actual
router.get('/me', async (req, res) => {
  // Este endpoint requiere authMiddleware, se conecta en app.ts
  return res.json({ success: true, data: (req as any).user });
});

export default router;
