
'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { PageLoader } from '@/components/ui/loader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // This is a simple way to simulate a loading state on route change.
    // In a real app with data fetching, you might use Suspense boundaries more extensively.
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Simulate a minimum loading time

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarNav />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Suspense fallback={<PageLoader />}>
                {loading ? <PageLoader /> : children}
            </Suspense>
        </main>
      </div>
    </div>
  );
}
