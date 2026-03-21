
'use client';

import { MobileNav } from "@/components/mobile-nav";
import { Suspense, useEffect, useState } from 'react';
import { PageLoader } from '@/components/ui/loader';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('chw');

  useEffect(() => {
    // Pure Frontend Logic: Check localStorage
    const isSessionActive = localStorage.getItem('demo_session') === 'true';
    if (!isSessionActive) {
      router.push('/login');
    } else {
      setRole(localStorage.getItem('demo_role') || 'chw');
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="p-4 flex items-center justify-between border-b sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-accent font-bold text-xs leading-none">AI</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-primary leading-tight text-sm">Epilepsy Assistant</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              {role.toUpperCase()} Mode
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/notifications" className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <Bell className="h-5 w-5 text-primary" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-background">
              3
            </span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 p-4">
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </main>

      <MobileNav userRole={role} />
    </div>
  );
}
