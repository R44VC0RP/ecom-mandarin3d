import CartModal from 'components/cart/modal';
import LogoSquare from 'components/logo-square';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';
import UserButton from './user-button';

const NAVIGATION = [
  { title: 'All Products', path: '/search' },
  { title: 'Collections', path: '/search/collections' },
];

export async function Navbar() {
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={NAVIGATION} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              MANDARIN3D<span className="text-[var(--m3d-primary)] font-bold">CUSTOM</span>
            </div>
          </Link>

        </div>
        <div className="hidden justify-end md:flex md:w-1/3 mr-10">
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {NAVIGATION.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-end space-x-2 md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
          <CartModal />
          <UserButton isLoggedIn={false} />
        </div>
      </div>
    </nav>
  );
}
