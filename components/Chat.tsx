'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { SendHorizonalIcon } from 'lucide-react';

import Input from './ui/Input';
import { Button } from './ui/Button';
import { ScrollArea } from './ui/ScrollArea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import CopyToClipboard from './CopyToClipboard';

export default function Chat() {
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
    });

  console.log('messages: ', messages);

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.scrollTo(0, ref.current.scrollHeight);
  });

  return (
    <section className='text-zinc-700'>
      <div className='container flex h-screen flex-col items-center justify-center'>
        <h1 className='font-serif text-2xl font-medium'>AI Chatbot</h1>
        <div className='mt-4 w-full max-w-lg'>
          {/*response container */}
          <ScrollArea className='mb-2 h-[500px] rounded-md p-4' ref={ref}>
            {error && (
              <div className='text-sm text-red-400'>{error.message}</div>
            )}
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
          <form onSubmit={handleSubmit} className='relative'>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder='Ask me anything...'
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
      </div>
    </section>
  );
}
