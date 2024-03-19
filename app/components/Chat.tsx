'use client';

import { useChat } from 'ai/react';
import React, { useEffect, useRef, useState } from 'react';
import { SendHorizonalIcon, Zap } from 'lucide-react';
import { toast } from 'sonner';

import Input from './ui/Input';
import { Button } from './ui/Button';
import { ScrollArea } from './ui/ScrollArea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import CopyToClipboard from './CopyToClipboard';
import { useUser, useClerk } from '@clerk/nextjs';
import { AddFreeCredits } from '@/lib/actions';
import { SubscriptionDialog } from './subscription-dialog';

export default function Chat() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn, session } = useClerk();

  console.log('session: ', session);
  console.log('useUser(): ', useUser());

  const credits = user?.publicMetadata?.credits;
  const newUser = typeof credits === 'undefined';
  const paidUser = user?.publicMetadata?.stripeCustomerId;

  const ref = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      initialMessages: [
        {
          id: Date.now().toString(),
          role: 'system',
          // content: 'You will reply in French',
          content: 'You are an assistant that gives short answers',
        },
      ],
      onResponse: (response) => {
        if (!response.ok) {
          const status = response.status;

          switch (status) {
            case 401:
              openSignIn();
              break;
            case 402:
              toast.error('You have no more credits remaining', {});
              break;
            default:
              toast.error(error?.message || 'Apologies, something went wrong');
          }
        }
      },
    });

  const [subscriptionDialogOpen, setSubscriptionDialogOpen] =
    useState<Boolean>(false);

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.scrollTo(0, ref.current.scrollHeight);
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignedIn) {
      handleSubmit(e);
    } else {
      openSignIn();
    }
  };
  const handleClick = async () => {
    const { success, error } = await AddFreeCredits();
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('10 credits added successfully');
    session?.reload();
  };

  return (
    <section className='text-zinc-700'>
      <div className='container max-w-lg'>
        <div className='mx-auto flex flex-row justify-between px-1'>
          <h1 className='font-serif text-2xl font-medium'>AI Chatbot</h1>
          {isSignedIn && newUser && (
            <Button
              size='sm'
              variant='outline'
              className='border-emerald-500'
              onClick={handleClick}
            >
              Redeem 10 free credits
            </Button>
          )}
          {isSignedIn && typeof credits === 'number' && (
            <div className='flex items-center gap-2'>
              <Zap className='h-5 w-5 text-emerald-500' />
              <span className='text-sm text-zinc-500'>Credits</span>
              <span className='font-medium'>{credits}</span>
            </div>
          )}

          {isSignedIn && !paidUser && !newUser && (
            <Button
              size='sm'
              variant='secondary'
              onClick={() => setSubscriptionDialogOpen(true)}
            >
              Get more credits
            </Button>
          )}
        </div>
        <div className='mt-4 w-full max-w-lg'>
          {/*response container */}
          <ScrollArea className='mb-2 h-[400px] rounded-md' ref={ref}>
            {messages.map((m) => (
              <div
                key={m.id}
                className=' my-3 mx-4 whitespace-pre-wrap md:mr-12'
              >
                {m.role === 'user' && (
                  <div className='mb-6 flex gap-3'>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback className='text-sm'>U</AvatarFallback>
                    </Avatar>
                    <div className='mt-1.5 w-full'>
                      <div className='flex justify-between'>
                        <p className='font semibold'>You</p>
                        <CopyToClipboard message={m} className='-mt-1' />
                      </div>
                      <div className='mt-2 text-sm text-zinc-500'>
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}
                {m.role === 'assistant' && (
                  <div className='mb-6 flex gap-3'>
                    <Avatar>
                      <AvatarImage src='' />
                      <AvatarFallback className='bg-emerald-500 text-white'>
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className='mt-1.5 w-full'>
                      <div className='flex justify-between'>
                        <p className='font semibold'>Bot</p>
                        <CopyToClipboard message={m} className='-mt-1' />
                      </div>
                      <div className='mt-2 text-sm text-zinc-500'>
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
          <form onSubmit={onSubmit} className='relative'>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={
                isSignedIn ? 'Ask me anything...' : 'Sign in to start'
              }
              className='pr-12 placeholder:italic placeholder:text-zinc-600'
            />
            <Button
              size='icon'
              type='submit'
              variant='secondary'
              disabled={isLoading}
              className='absolute right-1 top-1 h-8 w-10'
            >
              <SendHorizonalIcon className='h-5 w-5 text-emerald-500' />
            </Button>
          </form>
        </div>
        <SubscriptionDialog
          open={subscriptionDialogOpen}
          onOpenChnage={setSubscriptionDialogOpen}
        />
      </div>
    </section>
  );
}
