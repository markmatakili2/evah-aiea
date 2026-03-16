import { Brain } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary p-2 rounded-xl">
        <Brain className="h-6 w-6 text-accent" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-headline font-bold text-primary leading-tight">Epilepsy</span>
        <span className="text-sm font-medium text-muted-foreground -mt-1 tracking-wider uppercase">Assistant</span>
      </div>
    </div>
  );
};
