'use client';

import Link from 'next/link';
import React from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { UserButton } from '@clerk/nextjs';

import { Button } from '../components/ui/Button';

const Header = () => {
  return (
    <header className='py-6'>
      <div className='container flex max-w-3xl items-center justify-between'>
        <Link href=''>chat.ai</Link>
        <SignedIn>
          <UserButton afterSignOutUrl='/' />
        </SignedIn>
        <SignedOut>
          <SignInButton mode='modal'>
            <Button size='default' variant='outline'>
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
