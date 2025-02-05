'use client';

import { ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function UserButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
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