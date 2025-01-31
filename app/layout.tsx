import { CartProvider } from 'components/cart/cart-context';
import { GeistSans } from 'geist/font/sans';
import { getCart } from 'lib/prisma-queries';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const { SITE_NAME } = process.env;
const baseUrl = "https://mandarin3d.com";
const twitterCreator = "@mandarin3dprint";
const twitterSite = "https://mandarin3d.com";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite
      }
    })
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cartId = (await cookies()).get('cartId')?.value;
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart(cartId);

  return (
    <html lang="en" className={`${GeistSans.variable} dark`} data-admin-route="false" data-theme="dark">
      <body className="bg-white text-neutral-900 selection:bg-teal-300 dark:bg-[#1a1b1e] dark:text-neutral-100 dark:selection:bg-neutral-600 dark:selection:text-white">
        <CartProvider cartPromise={cart}>
          <main>
            {children}
            <Toaster closeButton />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
