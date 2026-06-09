import { Router } from 'express';
import { EmailCaptureModel } from '../models/EmailCapture';
import { sendEmailCapture } from '../services/email.service';
import { quizRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// POST /api/email/capture — Guardar email + enviar oferta
router.post('/capture', quizRateLimit, async (req, res) => {
  try {
    const { email, diagnostico } = req.body;

    if (!email || !diagnostico) {
      return res.status(400).json({ success: false, error: 'Email y diagnóstico requeridos' });
    }

    const offerCode = 'RAVEN50';
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 horas

    // Guardar en DB
    const capture = await EmailCaptureModel.create({
      email,
      quizResult: diagnostico,
      offerCode,
      expiresAt,
      used: false
    });

    // Enviar email
    const sent = await sendEmailCapture(email, diagnostico, offerCode);

    return res.json({
      success: true,
      data: {
        captureId: capture._id,
        emailSent: sent,
        offerCode,
        expiresAt
      }
    });
  } catch (error: any) {
    console.error('Error en email capture:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
