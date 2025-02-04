import { Navbar } from '@/components/layout/navbar';
import { ReactNode } from 'react';

// Toggle this to switch between plain and textured background
const USE_TEXTURED_BACKGROUND = true;

export default async function RootLayout({ children }: { children: ReactNode }) {  
  return (
    <div className={`relative min-h-screen bg-[#1A1B1E] ${USE_TEXTURED_BACKGROUND ? 'overflow-hidden' : ''}`}>
      {USE_TEXTURED_BACKGROUND && (
        <>
          {/* Subtle grid pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
          
          {/* Radial gradient for depth */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_400px,#35373d,transparent)] opacity-30" />
        </>
      )}
      
      <Navbar />
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
