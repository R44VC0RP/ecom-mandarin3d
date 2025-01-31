import { FaceFrownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <FaceFrownIcon className="h-16 w-16 text-neutral-400 dark:text-neutral-500" />
      <div className="max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          404 - Dashboard Page Not Found
        </h1>
        <p className="mb-8 text-base text-neutral-600 dark:text-neutral-400">
          The dashboard page you are looking for might have been moved or doesn't exist.
        </p>
        <Link
          href="/dashboard"
          className="rounded-md bg-[--m3d-primary] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[--m3d-primary-border]"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
} 