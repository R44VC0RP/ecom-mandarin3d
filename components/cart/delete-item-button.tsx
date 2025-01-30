'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { removeItem } from 'components/cart/actions';
import { CartLine } from 'lib/types/cart';
import { useActionState } from 'react';

export function DeleteItemButton({
  item,
  className
}: {
  item: CartLine;
  className?: string;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const actionWithVariant = formAction.bind(null, merchandiseId);

  return (
    <button
      aria-label="Remove cart item"
      onClick={actionWithVariant}
      disabled={!formAction}
      className={clsx(
        'ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
        {
          'cursor-not-allowed px-0': !formAction
        },
        className
      )}
    >
      <XMarkIcon className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
    </button>
  );
}
