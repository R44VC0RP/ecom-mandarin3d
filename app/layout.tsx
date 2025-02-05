import { CartProvider } from 'components/cart/cart-context';
import { Providers } from 'components/providers';
import { GeistSans } from 'geist/font/sans';
import { authOptions } from 'lib/auth';
import { getCart } from 'lib/prisma-queries';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
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

// Server component
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const cartPromise = getCart(session?.user?.id);

  return (
    <html lang="en" className={`${GeistSans.variable} dark`} data-admin-route="false" data-theme="dark">
      <body className="bg-white text-neutral-900 selection:bg-teal-300 dark:bg-[#1a1b1e] dark:text-neutral-100 dark:selection:bg-neutral-600 dark:selection:text-white">
        <Providers>
          <Suspense>
            <CartProvider cartPromise={cartPromise} userId={session?.user?.id}>
              <main>
                {children}
              </main>
            </CartProvider>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
