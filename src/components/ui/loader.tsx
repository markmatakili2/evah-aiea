
'use client';

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

export const PageLoader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-[20rem] w-full items-center justify-center bg-background",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-dashed border-primary/50"></div>
        <div className="animate-pulse">
          <Logo />
        </div>
      </div>
    </div>
  );
};
