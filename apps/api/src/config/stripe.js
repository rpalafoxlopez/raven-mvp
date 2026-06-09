const Stripe = require('stripe');

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

const PRICE_IDS = {
  premium_monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
  premium_yearly:  process.env.STRIPE_PRICE_PREMIUM_YEARLY,
  pro_monthly:     process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_yearly:      process.env.STRIPE_PRICE_PRO_YEARLY
};

module.exports = { stripe, PRICE_IDS };
