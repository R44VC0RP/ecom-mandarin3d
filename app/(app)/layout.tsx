import { Navbar } from '@/components/layout/navbar';
import { ReactNode } from 'react';

export default async function RootLayout({ children }: { children: ReactNode }) {  

  return (
    <div>
        <Navbar />
      {children}
    </div>
  );
}
