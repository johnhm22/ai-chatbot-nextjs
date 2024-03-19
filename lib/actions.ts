'use server';

import { clerkClient, currentUser } from '@clerk/nextjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export const createStripeCheckoutSession = async (lineItems: LineItem[]) => {
  const user = await currentUser();
  if (!user) {
    return { sessionId: null, checkoutError: 'Please sign in' };
  }
  // const origin = process.env.NEXT_PUBLIC_SITE_URL as string;
  const origin = 'http://localhost';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: lineItems,
    success_url: `${origin}/checkout?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: origin,
    customer_email: user.emailAddresses[0].emailAddress,
  });

  return { sessionId: session.id, checkoutError: null };
};

export const AddFreeCredits = async () => {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: 'Please log in first' };
  }

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: 10,
    },
  });

  return { success: true, error: null };
};

export const retrieveStripeCheckoutSession = async (sessionId: string) => {
  if (!sessionId) {
    return { success: false, error: 'No session ID provided' };
  }
  const user = await currentUser();
  if (!user) {
    return { success: false, error: 'Please sign in' };
  }

  const previousCheckoutSessionIds = Array.isArray(
    user.publicMetadata.previousCheckoutSessionIds
  )
    ? user.publicMetadata.previousCheckoutSessionIds
    : [];

  if (previousCheckoutSessionIds.includes(sessionId)) {
    return {
      success: true,
      error: null,
    };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription'],
  });
  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      credits: 100,
      checkoutSessionIds: [...previousCheckoutSessionIds, sessionId],
      stripeCustomerId: session.customer,
      stripeSubscriptionId:
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id,
      stripeCurrentPeriodEnd:
        typeof session.subscription === 'string'
          ? undefined
          : session.subscription?.current_period_end,
    },
  });
};
