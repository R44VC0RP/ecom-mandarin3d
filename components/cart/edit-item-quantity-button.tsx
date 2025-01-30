'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { updateItemQuantity } from 'components/cart/actions';
import { CartLine } from 'lib/types/cart';
import { useActionState } from 'react';
import { FaSpinner } from 'react-icons/fa';

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
  return (
    <button
      type="submit"
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'ml-auto': type === 'minus',
          'mr-auto': type === 'plus'
        }
      )}
    >
      {type === 'minus' ? (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type
}: {
  item: CartLine;
  type: 'plus' | 'minus';
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const quantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
  const actionWithVariant = formAction?.bind(null, {
    merchandiseId: item.merchandise.id,
    quantity
  });
  const isLoading = !actionWithVariant;

  return (
    <button
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      onClick={actionWithVariant}
      disabled={isLoading || (type === 'minus' && item.quantity === 1)}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'ml-auto': type === 'minus',
          'mr-auto': type === 'plus',
          'cursor-not-allowed': isLoading || (type === 'minus' && item.quantity === 1)
        }
      )}
    >
      {isLoading ? (
        <FaSpinner className="h-4 w-4 animate-spin dark:text-neutral-500" />
      ) : type === 'minus' ? (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}
