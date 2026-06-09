import { stripe, PRICE_IDS } from '../config/stripe';
import { PLANES } from '@raven/shared-types';

export const createCheckoutSession = async (
  userId: string,
  planId: 'premium' | 'pro',
  billing: 'monthly' | 'yearly',
  successUrl: string,
  cancelUrl: string,
  offerCode?: string
): Promise<{ url: string; sessionId: string } | null> => {
  if (!stripe) {
    console.warn('Stripe no configurado');
    return null;
  }

  const priceKey = `${planId}_${billing}` as keyof typeof PRICE_IDS;
  const priceId = PRICE_IDS[priceKey];

  if (!priceId) {
    throw new Error(`Price ID no encontrado para ${planId}_${billing}`);
  }

  const lineItems: any = {
    price: priceId,
    quantity: 1
  };

  // Si hay código de oferta, aplicar descuento
  const discounts = offerCode
    ? [{ coupon: await getOrCreateCoupon(offerCode) }]
    : undefined;

  const session = await stripe.checkout.sessions.create({
    customer_email: undefined, // Se llenará desde el frontend
    line_items: [lineItems],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planId,
      offerCode: offerCode || ''
    },
    ...(discounts ? { discounts } : {})
  });

  return {
    url: session.url!,
    sessionId: session.id
  };
};

const getOrCreateCoupon = async (code: string): Promise<string> => {
  // En producción: buscar cupón existente o crearlo
  // Simplificado para el scaffolding
  return code;
};

export const handleWebhook = async (payload: string, signature: string) => {
  if (!stripe) return null;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as any;
      // Actualizar plan del usuario en DB
      console.log('Pago completado:', session.metadata);
      break;
    case 'invoice.payment_failed':
      // Manejar fallo de pago
      break;
    case 'customer.subscription.deleted':
      // Cancelar suscripción
      break;
  }

  return event;
};
