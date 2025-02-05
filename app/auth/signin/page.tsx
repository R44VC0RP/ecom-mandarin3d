'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1b1e]">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[#1e1f22] p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Sign in to Mandarin3D</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Access your cart, orders, and more
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-100"
          >
            <FaGoogle className="h-5 w-5" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
} 