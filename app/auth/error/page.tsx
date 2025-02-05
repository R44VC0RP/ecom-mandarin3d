'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1b1e]">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[#1e1f22] p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Authentication Error</h2>
          <p className="mt-2 text-sm text-red-400">
            {error === 'AccessDenied'
              ? 'You do not have permission to sign in.'
              : 'There was a problem signing you in.'}
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/auth/signin"
            className="block w-full rounded-full bg-[--m3d-primary-border] px-4 py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 