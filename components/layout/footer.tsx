import ExonIcon from 'components/exon-icon';
import LogoSquare from 'components/logo-square';
import Link from 'next/link';



export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const copyrightName = "Mandarin 3D Prints"

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare size="sm" />
            <span className="uppercase">{copyrightName}</span>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/faq" className="hover:text-black dark:hover:text-white">
            FAQ
          </Link>
          <Link href="/terms-of-service" className="hover:text-black dark:hover:text-white">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:text-black dark:hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/shipping" className="hover:text-black dark:hover:text-white">
            Shipping Information
          </Link>
          <Link href="/returns" className="hover:text-black dark:hover:text-white">
            Returns & Refunds
          </Link>
          <Link href="/contact" className="hover:text-black dark:hover:text-white">
            Contact Us
          </Link>
        </div>
        
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p>
            
          </p>
          <p className="md:ml-auto">
            <a href="https://exonenterprise.com" className="text-black dark:text-white inline-flex items-center gap-1">Powered by <ExonIcon size={16} /> Exon </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
