import { MobileNav } from "@/components/mobile-nav";
import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/loader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="p-4 flex items-center justify-between border-b sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-accent font-bold text-xs leading-none">AI</span>
          </div>
          <span className="font-headline font-bold text-primary">Epilepsy Assistant</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
            <img src="https://picsum.photos/seed/chw1/100" alt="Profile" />
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-4">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>

      <MobileNav />
    </div>
  );
}
