'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';

import { useClipboard } from '@/app/hooks/use-clipboard';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';

interface Message {
  content: string;
  role: string;
  id: string;
}

interface ChatMessageActionProps {
  message: Message;
  className: string;
}

const CopyToClipboard = ({
  message,
  className,
  ...props
}: ChatMessageActionProps) => {
  const { isCopied, copyToClipboard } = useClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  return (
    <div className={cn('', className)} {...props}>
      <Button
        variant='secondary'
        size='icon'
        className='h-8 w-8'
        onClick={onCopy}
      >
        {isCopied ? (
          <CheckIcon className='h-4 w-4 text-emerald-500' />
        ) : (
          <CopyIcon className='h-4 w-4 text-zinc-500' />
        )}
        <span className='sr-only'>Copy message</span>
      </Button>
    </div>
  );
};

export default CopyToClipboard;
