'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaEnvelope, FaUser } from 'react-icons/fa';

export default function AccountPage() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="mx-auto grid max-w-4xl gap-3 px-3 pb-3">
      <div className="rounded-lg border border-neutral-700/50 bg-[#1e1f22] p-6">
        <div className="flex items-start gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-neutral-700/50">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'Profile'}
                className="object-cover"
                fill
                sizes="96px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-800">
                <FaUser className="h-12 w-12 text-neutral-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-neutral-100">{session.user.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
              <FaEnvelope className="h-4 w-4" />
              {session.user.email}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-700/50 bg-[#1e1f22] p-6">
          <h2 className="text-lg font-bold text-neutral-100">Account Details</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs text-neutral-400">Name</label>
              <div className="mt-1 rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-100">
                {session.user.name}
              </div>
            </div>
            <div>
              <label className="text-xs text-neutral-400">Email</label>
              <div className="mt-1 rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-100">
                {session.user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-700/50 bg-[#1e1f22] p-6">
          <h2 className="text-lg font-bold text-neutral-100">Account Activity</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs text-neutral-400">Member Since</label>
              <div className="mt-1 rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-100">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <div>
              <label className="text-xs text-neutral-400">Last Login</label>
              <div className="mt-1 rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-100">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 