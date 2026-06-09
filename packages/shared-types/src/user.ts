import type { PillarSlug } from './quiz';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface UserProfile {
  userId: string;
  dominantPillar: PillarSlug;
  secondaryPillar: PillarSlug;
  tertiaryPillar: PillarSlug;
  quizCompletedAt: Date;
  hasSeenResults: boolean;
}

export interface EmailCapture {
  email: string;
  quizResult?: {
    dominant: PillarSlug;
    secondary: PillarSlug;
  };
  offerCode: string;
  expiresAt: Date;
  createdAt: Date;
  converted: boolean;
}
