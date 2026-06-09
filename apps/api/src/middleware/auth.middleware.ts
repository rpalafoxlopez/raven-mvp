import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifySupabaseToken } from '../config/supabase';
import { UserModel } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    plan: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Intentar verificar con Supabase
    let supabaseUser = await verifySupabaseToken(token);

    if (supabaseUser) {
      // Buscar o crear usuario en MongoDB
      let user = await UserModel.findOne({ auth_id: supabaseUser.id });
      if (!user) {
        user = await UserModel.create({
          email: supabaseUser.email!,
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

    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = { id: decoded.id, email: decoded.email, plan: decoded.plan };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }
};

export const requirePlan = (plans: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'No autenticado' });
    }
    if (!plans.includes(req.user.plan)) {
      return res.status(403).json({ success: false, error: 'Plan requerido no activo' });
    }
    next();
  };
};
