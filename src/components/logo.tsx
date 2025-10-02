import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
      >
        <path d="M18 0L33.5885 9V27L18 36L2.41155 27V9L18 0Z" fill="#1B2D6B"/>
        <path d="M18 0L33.5885 9V27L18 36V0Z" fill="#41E0DC"/>
        <path d="M11.6364 21.2727C14.5455 21.2727 18 19.3377 18 15.5V10.2273C18 6.39091 14.5455 4.5 11.6364 4.5H4.5V27H11.6364C14.5455 27 18 25.1091 18 21.2727" stroke="#1B2D6B" strokeWidth="3" strokeLinejoin="round"/>
      </svg>

      <span className="text-2xl font-headline font-bold text-primary">DigiLab</span>
    </div>
  );
};
