'use client';

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCart } from './cart-context';

export default function CartButton() {
  const { cart } = useCart();

  return (
    <Link href="/cart" className="relative">
      <button
        aria-label="Cart"
        className="h-10 w-10 rounded-md border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black"
      >
        <ShoppingCartIcon className="h-5 w-5 text-black transition-all ease-in-out hover:scale-110 dark:text-white" />
        {cart?.totalQuantity ? (
          <div className="absolute -right-2 -top-2 h-4 w-4 rounded bg-[--m3d-primary-border] text-[11px] font-medium text-white">
            {cart.totalQuantity}
          </div>
        ) : null}
      </button>
    </Link>
  );
} 