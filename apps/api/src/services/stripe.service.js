const { stripe, PRICE_IDS } = require('../config/stripe');

const createCheckoutSession = async (userId, planId, billing, successUrl, cancelUrl, offerCode) => {
  if (!stripe) { console.warn('Stripe no configurado'); return null; }

  const priceKey = `${planId}_${billing}`;
  const priceId = PRICE_IDS[priceKey];
  if (!priceId) throw new Error(`Price ID no encontrado: ${priceKey}`);

  const sessionParams = {
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId, planId, offerCode: offerCode || '' }
  };

  if (offerCode) {
    sessionParams.discounts = [{ coupon: offerCode }];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return { url: session.url, sessionId: session.id };
};

const handleWebhook = (payload, signature) => {
  if (!stripe) return null;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  return event;
};

module.exports = { createCheckoutSession, handleWebhook };
