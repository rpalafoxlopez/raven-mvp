const { Router } = require('express');
const { createCheckoutSession, handleWebhook } = require('../services/stripe.service');
const { authMiddleware } = require('../middleware/auth.middleware');
const { UserModel } = require('../models/User');

const router = Router();

// POST /api/stripe/checkout
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { planId, billing, offerCode } = req.body;
    if (!planId || !billing) return res.status(400).json({ success: false, error: 'planId y billing requeridos' });

    const successUrl = `${process.env.FRONTEND_URL}/dashboard?payment=success`;
    const cancelUrl  = `${process.env.FRONTEND_URL}/checkout?canceled=true`;

    const session = await createCheckoutSession(req.user.id, planId, billing, successUrl, cancelUrl, offerCode);
    if (!session) return res.status(500).json({ success: false, error: 'Error creando sesión de pago' });

    return res.json({ success: true, data: session });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/stripe/webhook
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const event = handleWebhook(req.body, signature);
    if (!event) return res.json({ received: true });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, planId } = session.metadata || {};
      if (userId && planId) {
        await UserModel.findByIdAndUpdate(userId, { plan: planId });
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      if (userId) {
        await UserModel.findByIdAndUpdate(userId, { plan: 'free' });
      }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
