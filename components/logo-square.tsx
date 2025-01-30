import clsx from 'clsx';
import LogoNew from './icons/logo';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  return (
    <div
      className={clsx(
        'flex flex-none items-center justify-center border border-[#58606C] bg-[#393E46]',
        {
          'h-[40px] w-[40px] rounded-xl': !size,
          'h-[30px] w-[30px] rounded-lg': size === 'sm'
        }
      )}
    >
      <LogoNew
        className={clsx({
          'h-[40px] w-[40px] -mb-1.5': !size,
          'h-[30px] w-[30px] -mb-1.5': size === 'sm'
        })}
      />
    </div>
  );
}
