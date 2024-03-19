import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from './ui/drawer';

import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import React from 'react';

import { createStripeCheckoutSession } from '@/lib/actions';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const tiers = [
  {
    name: 'Get more credits',
    id: 'tier-freelancer',
    href: '#',
    price: { monthly: '£5', annually: '£50' },
    description: 'Use AI to get higher marks!',
    features: ['100 credits', 'Ask me anything', 'Covers 100 questions'],
    mostPopular: false,
  },
];

export const SubscriptionDialog = (
  props: React.ComponentProps<typeof DrawerPrimitive.Root>
) => {
  const handleCheckout = async () => {
    console.log('handleCheckout called');
    try {
      const lineItems = [
        {
          price: 'price_1OvdrzHbtKoVLVFpNaRszXim',
          quantity: 1,
        },
      ];

      const { sessionId, checkoutError } = await createStripeCheckoutSession(
        lineItems
      );

      if (!sessionId || checkoutError) {
        throw new Error(checkoutError || 'Failed to create a checkout session');
      }
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Failed to load stripe');
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        if (error instanceof Error) throw new Error(error.message);
      } else {
        throw error;
      }
    } catch (error: any) {
      toast.error(error?.message || 'failed to create a checkout session');
    }
  };
  return (
    <Drawer {...props}>
      <DrawerContent>
        <div className='mx-auto w-full max-w-md'>
          <DrawerHeader></DrawerHeader>
          <div className='isolate grid grid-cols-1 gap-8 px-3'>
            {tiers.map((tier) => (
              <div
                key={Math.random()}
                className={cn(
                  tier.mostPopular
                    ? 'ring-2 ring-emerald-600'
                    : 'ring-1 ring-gray-200',
                  'rounded-3xl p-8 xl:p-10'
                )}
              >
                <div className='flex items-center justify-between gap-x-4'>
                  <h3
                    id={tier.id}
                    className={cn(
                      tier.mostPopular ? 'text-emerald-600' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className='rounded-full bg-emerald-600/10 px-2.5 py-1 font-semibold leading-5 text-emerald-600'>
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className='mt-4 text-sm leading-6 text-gray-600'>
                  {tier.description}
                </p>
                <p className='mt-6 flex items-baseline gap-x-1'>
                  <span className='text-4xl font-bold tracking-tight text-gray-900'>
                    {tier.price.monthly}
                  </span>
                  <span className='text-sm font-semibold leading-6 text-gray-600'>
                    /month
                  </span>
                </p>
                <button
                  onClick={handleCheckout}
                  aria-describedby={tier.id}
                  className={cn(
                    tier.mostPopular
                      ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500'
                      : 'text-emerald-600 ring-1 ring-inset ring-emerald-200 hover:ring-emerald-300',
                    'mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                  )}
                >
                  Get started today
                </button>
                <ul
                  role='list'
                  className='mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10'
                >
                  {tier.features.map((feature) => (
                    <li key={Math.random()}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <DrawerFooter></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
