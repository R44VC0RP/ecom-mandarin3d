import { Navbar } from '@/components/layout/navbar';
import { ReactNode } from 'react';
export default async function RootLayout({ children }: { children: ReactNode }) {  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}
