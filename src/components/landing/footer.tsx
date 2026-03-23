import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground italic">
              Empowering Community Health Workers with WHO-aligned Clinical Decision Support.
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-primary">Project</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#about" className="text-sm text-muted-foreground hover:text-primary">About AIEA</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Ethics & Governance</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-primary">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">Clinical Engine</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Training Manuals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-primary">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex justify-between text-center text-sm text-muted-foreground">
          <p>&copy; 2026 AI Epilepsy Assistant Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}