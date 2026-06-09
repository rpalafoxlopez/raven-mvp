import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../services/stripe.service';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { UserModel } from '../models/User';

const router = Router();

// POST /api/stripe/checkout — Crear sesión de checkout
router.post('/checkout', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { planId, billing, offerCode } = req.body;

    if (!planId || !billing) {
      return res.status(400).json({ success: false, error: 'planId y billing requeridos' });
    }

    const successUrl = `${process.env.FRONTEND_URL}/dashboard?payment=success`;
    const cancelUrl = `${process.env.FRONTEND_URL}/checkout?canceled=true`;

    const session = await createCheckoutSession(
      req.user!.id,
      planId,
      billing,
      successUrl,
      cancelUrl,
      offerCode
    );

    if (!session) {
      return res.status(500).json({ success: false, error: 'Error creando sesión de pago' });
    }

    return res.json({ success: true, data: session });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stripe/webhook — Webhook de Stripe (NO requiere auth, raw body)
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const payload = req.body;

    const event = await handleWebhook(payload, signature);

    if (event?.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const { userId, planId } = session.metadata;

      // Actualizar plan del usuario
      await UserModel.findByIdAndUpdate(userId, {
        plan: planId,
        updated_at: new Date()
      });
    }

    return res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
