import Stripe from 'stripe';
import User from '../models/User.js';

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  premium:   { name: 'Premium',    priceIdEnv: 'STRIPE_PRICE_PREMIUM' },
  agency:    { name: 'Pro Agency', priceIdEnv: 'STRIPE_PRICE_AGENCY' },
  corporate: { name: 'Corporate',  priceIdEnv: 'STRIPE_PRICE_CORPORATE' }
};

export async function createCheckoutSession({ plan, userId, email }) {
  const planData = PLANS[plan];
  if (!planData) throw new Error('Plan inválido');

  const priceId = process.env[planData.priceIdEnv];
  if (!priceId) throw new Error(`${planData.priceIdEnv} no configurado`);

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
    customer_email: email,
    metadata: { 
      userId: userId.toString(), // Asegurar que sea string
      plan 
    },
    subscription_data: {
      metadata: { 
        userId: userId.toString()  // 🔑 CRÍTICO: Guardar userId también en la suscripción
      }
    }
  });

  return session;
}

export async function handleWebhook(payload, signature) {
  const event = getStripe().webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { userId, plan } = session.metadata || {};
      
      if (!userId || !plan) {
        console.warn('⚠️ Webhook: metadata incompleta', session.metadata);
        break;
      }

      const user = await User.findById(userId);
      if (!user) {
        console.error(`❌ Usuario ${userId} no encontrado`);
        break;
      }

      // Guardar subscriptionId para futuras referencias
      const subscriptionId = session.subscription;
      await User.findByIdAndUpdate(userId, { 
        plan,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date()
      });
      
      console.log(`✅ Plan actualizado: ${user.email} → ${plan}`);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId; // ✅ Ahora sí existe
      
      if (!userId) {
        console.warn('⚠️ Subscription sin userId en metadata');
        break;
      }

      const user = await User.findById(userId);
      if (!user) {
        console.error(`❌ Usuario ${userId} no encontrado`);
        break;
      }

      await User.findByIdAndUpdate(userId, { 
        plan: 'free',
        stripeSubscriptionId: null
      });
      
      console.log(`🔄 Plan revertido a free: ${user.email}`);
      break;
    }

    case 'invoice.payment_failed': {
      // Opcional: notificar al usuario
      console.warn('⚠️ Pago fallido:', event.data.object.customer_email);
      break;
    }

    default:
      console.log(`ℹ️ Evento no manejado: ${event.type}`);
  }

  return event;
}