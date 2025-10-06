
'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { PageLoader } from '@/components/ui/loader';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 group-[[data-sidebar-state=expanded]]:sm:pl-[--sidebar-width]">
          <DashboardHeader />
          <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <Suspense fallback={<PageLoader />}>
                  {children}
              </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
