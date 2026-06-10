import Stripe from 'stripe';
import User from '../models/User.js';

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  premium:   { name: 'Premium',      currency: 'mxn' },
  agency:    { name: 'Pro Agency',   currency: 'usd' },
  corporate: { name: 'Corporate',    currency: 'usd' }
};

export async function createCheckoutSession({ plan, userId, email }) {
  const planData = PLANS[plan];
  if (!planData) throw new Error('Plan inválido');

  const priceId = process.env[`STRIPE_PRICE_${plan.toUpperCase()}`];
  if (!priceId) throw new Error(`STRIPE_PRICE_${plan.toUpperCase()} no configurado`);

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
    customer_email: email,
    metadata: { userId, plan }
  });

  return session;
}

export async function handleWebhook(payload, signature) {
  const event = getStripe().webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const { userId, plan } = event.data.object.metadata || {};
    if (userId && plan) {
      await User.findByIdAndUpdate(userId, { plan });
      console.log(`✅ Plan actualizado: user ${userId} → ${plan}`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const userId = event.data.object.metadata?.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { plan: 'free' });
      console.log(`Plan revertido a free: user ${userId}`);
    }
  }

  return event;
}
