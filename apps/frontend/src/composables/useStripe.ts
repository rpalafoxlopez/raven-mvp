import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export const useStripe = () => {
  const redirectToCheckout = async (sessionUrl: string) => {
    window.location.href = sessionUrl
  }

  const createCheckout = async (planId: 'premium' | 'pro', billing: 'monthly' | 'yearly', offerCode?: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('raven-token') || ''}`
      },
      body: JSON.stringify({ planId, billing, offerCode })
    })
    const data = await response.json()
    if (data.success) {
      redirectToCheckout(data.data.url)
    }
    return data
  }

  return { stripePromise, redirectToCheckout, createCheckout }
}
