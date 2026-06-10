import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createCheckoutSession, handleWebhook } from '../services/stripe.js';

const router = express.Router();

// POST /api/stripe/checkout
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan) return res.status(400).json({ error: 'plan requerido' });

    const session = await createCheckoutSession({
      plan,
      userId: req.user._id.toString(),
      email: req.user.email
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/webhook — raw body, sin auth
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    await handleWebhook(req.body, signature);
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

export default router;
