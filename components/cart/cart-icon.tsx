'use client';

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useCart } from './cart-context';

export default function CartIcon() {
  const { cart } = useCart();
  const itemCount = cart.totalItems;

  return (
    <div className="relative">
      <ShoppingBagIcon
        className={clsx('h-6 w-6', {
          'text-white': itemCount > 0,
          'text-neutral-500': itemCount === 0
        })}
      />
      {itemCount > 0 && (
        <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[--m3d-primary-border] text-[10px] font-bold text-white">
          {itemCount}
        </div>
      )}
    </div>
  );
} 