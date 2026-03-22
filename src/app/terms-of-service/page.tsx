import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <Card className="max-w-4xl mx-auto border-none shadow-none">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary text-center italic">
              Ethics & Governance Framework
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-primary prose-headings:font-headline leading-relaxed">
            <p className="text-sm text-muted-foreground text-center mb-10">Effective Date: January 1, 2026</p>
            
            <h2>1. Clinical Decision Authority</h2>
            <p>
              The AI Epilepsy Assistant (AIEA) is a Clinical Decision Support System (CDSS). It provides suggestive analysis based on WHO mhGAP protocols. <strong>Final clinical authority and legal responsibility for patient management remain exclusively with the authorized healthcare worker.</strong>
            </p>

            <h2>2. Data Privacy & National Policy</h2>
            <p>
              All patient data is handled in accordance with the Data Protection Act. We ensure encryption at rest and in transit. Clinical logs are used for quality audit and Safety monitoring (MEL) to improve PHC delivery.
            </p>

            <h2>3. Emergency Protocols</h2>
            <p>
              In cases of status epilepticus or other "Red Flags", the system prioritizes safety alerts. Users are mandated to follow national emergency escalation pathways immediately upon detection of these triggers.
            </p>

            <h2>4. No Financial Transactions</h2>
            <p>
              AIEA is a clinical support tool for public health delivery. There are no fees, payments, or commercial diagnostic requests processed within this platform. Any references to regional health clinics are for referral coordination only.
            </p>

            <h2>5. Ethical AI Use</h2>
            <p>
              We are committed to anti-stigma counseling. The AI engine is audited regularly for clinical discordance to ensure protocol variance is captured and analyzed by regional supervisors.
            </p>

            <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
              <p>© 2026 AI Epilepsy Assistant Project. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}