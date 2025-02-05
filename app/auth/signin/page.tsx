'use client';

import LogoSquare from 'components/logo-square';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';

export default function SignIn() {
  return (
    <div className="mx-auto grid gap-3 px-3 pb-3">
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-lg border border-neutral-700/50 bg-[#1e1f22] p-6 shadow-lg">
          <div className="text-center">
            <Link href="/" className="mx-auto mb-4 flex w-fit items-center justify-center">
              <LogoSquare />
              <span className="ml-2 text-sm font-medium uppercase">
                MANDARIN3D<span className="text-[--m3d-primary-border] font-bold">CUSTOM</span>
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-neutral-100">Welcome Back</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Sign in to access your cart, orders, and custom prints
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-700/50 bg-neutral-800/50 px-4 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-800"
            >
              <FaGoogle className="h-4 w-4 text-[--m3d-primary-border]" />
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#1e1f22] px-2 text-neutral-400">or</span>
              </div>
            </div>

            <Link 
              href="/"
              className="flex w-full items-center justify-center rounded-md border border-neutral-700/50 bg-neutral-800/50 px-4 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800"
            >
              Continue as Guest
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-400">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-[--m3d-primary-border] hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[--m3d-primary-border] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 