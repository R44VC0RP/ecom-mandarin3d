'use client';

import { ArrowRightOnRectangleIcon, ShoppingBagIcon, UserCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function UserButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (session?.user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-600"
        >
          {session.user.image ? (
            <div className="relative h-7 w-7 overflow-hidden rounded-full">
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="object-cover"
                fill
                sizes="28px"
              />
            </div>
          ) : (
            <UserIcon className="h-5 w-5 transition-all ease-in-out hover:scale-110" />
          )}
          <div className="absolute right-0 top-0 -mr-2 -mt-2 h-2 w-2 rounded-full bg-[--m3d-primary-border]" />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-14 z-50 w-56 rounded-lg border border-neutral-700/50 bg-[#1e1f22] p-2 shadow-lg">
              <div className="border-b border-neutral-700/50 px-2 pb-2">
                <p className="text-sm font-medium text-neutral-100">{session.user.name}</p>
                <p className="text-xs text-neutral-400">{session.user.email}</p>
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  href="/account"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircleIcon className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBagIcon className="h-4 w-4" />
                  Orders
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Link href="/auth/signin">
      <button className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-600">
        <ArrowRightOnRectangleIcon className="h-5 w-5 transition-all ease-in-out hover:scale-110" />
      </button>
    </Link>
  );
} 