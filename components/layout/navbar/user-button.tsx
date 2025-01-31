import { ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface UserButtonProps {
  className?: string;
  isLoggedIn?: boolean;
  onClick?: () => void;
}

export default function UserButton({
  className,
  isLoggedIn,
  onClick
}: UserButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:text-white dark:hover:border-neutral-600"
    >
      {isLoggedIn ? (
        <UserIcon
          className={clsx('h-5 w-5 transition-all ease-in-out hover:scale-110 ' , className)}
        />
      ) : (
        <ArrowRightOnRectangleIcon
          className={clsx('h-5 w-5 transition-all ease-in-out hover:scale-110', className)}
        />
      )}

      {isLoggedIn ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-2 w-2 rounded-full bg-[--m3d-primary-border]" />
      ) : null}
    </button>
  );
} 