import { TestTube2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <TestTube2 className="h-7 w-7 text-accent" />
      <span className="text-2xl font-headline font-bold">DigiLab</span>
    </div>
  );
};
