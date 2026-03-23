'use client';

import { use, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ChevronLeft, 
  Download, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Clock,
  Filter,
  User,
  Edit3,
  FileSearch
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format, isAfter, subHours, isValid, differenceInHours } from 'date-fns';
import { useRouter } from 'next/navigation';
import { usePrint } from '@/hooks/usePrint';
import { mockPatients, mockEncounters } from '@/lib/mock-data';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const formatSafeDate = (dateValue: any, formatStr: string = 'PPP p') => {
  if (!dateValue) return 'N/A';
  const date = new Date(dateValue);
  if (!isValid(date)) return 'Invalid Date';
  return format(date, formatStr);
};

export default function PatientHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { print } = usePrint();
  const { toast } = useToast();
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedEncounter, setSelectedEncounter] = useState<any | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideNotes, setOverrideNotes] = useState("");

  const role = typeof window !== 'undefined' ? localStorage.getItem('demo_role') : 'chw';
  const isClinician = role === 'clinician';

  const patient = mockPatients.find(p => p.id === id);
  const patientEncounters = mockEncounters.filter(e => e.patientId === id);

  const filteredEncounters = useMemo(() => {
    if (!patientEncounters) return [];
    if (timeFilter === 'all') return patientEncounters;
    const now = new Date();
    const days = parseInt(timeFilter);
    const cutoff = subHours(now, days * 24);
    
    return patientEncounters.filter(e => {
      const date = new Date(e.date);
      return isValid(date) && isAfter(date, cutoff);
    });
  }, [patientEncounters, timeFilter]);

  const handleOverrideSubmit = () => {
    toast({ title: "Clinical Override Saved", description: "Assessment updated with clinician high-tier notes." });
    setShowOverride(false);
    setOverrideNotes("");
  };

  const handleDownload = (encounterToPrint?: any) => {
    const p = patient;
    const e = encounterToPrint || filteredEncounters[0];
    if (!p || !e) return;

    const reportContent = (
      <div className="p-8 max-w-4xl mx-auto bg-white text-slate-900" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <header className="border-b-2 border-primary pb-6 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary uppercase">Clinical Encounter Report</h1>
            <p className="text-sm text-slate-500 mt-1 uppercase font-bold tracking-tight">AI Epilepsy Assistant • Medical Record</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{format(new Date(), 'PPP')}</p>
            <p className="text-xs text-slate-400">Record ID: {e.id.toUpperCase()}</p>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">1. Patient Demographics</h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <p><strong>Full Name:</strong> {p.name}</p>
            <p><strong>Contact:</strong> {p.contact}</p>
            <p><strong>Age / Sex:</strong> {p.age}Y • {p.gender}</p>
            <p><strong>Location:</strong> {p.location}</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">2. Assessment Details</h2>
          <div className="space-y-4 text-sm">
            <p><strong>Date of Assessment:</strong> {formatSafeDate(e.date)}</p>
            <p><strong>Primary Author:</strong> {e.authorName} ({e.authorRole})</p>
            <p><strong>Risk Flag:</strong> {e.recommendation.urgencyLevel} RISK</p>
            <div className="bg-slate-50 p-4 border rounded">
              <p className="font-bold underline mb-1">Clinical Summary:</p>
              <p>{e.summary}</p>
            </div>
            {e.redFlags.length > 0 && (
              <div>
                <p><strong>Red Flags Reported:</strong></p>
                <ul className="list-disc pl-5">
                  {e.redFlags.map((rf: string, idx: number) => <li key={idx}>{rf}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">3. Recommended Actions</h2>
          <div className="space-y-4 text-sm">
            <p><strong>Suggested Action:</strong> {e.recommendation.action}</p>
            <p><strong>Referral Destination:</strong> {e.recommendation.referralDestination}</p>
            <div>
              <p className="font-bold underline mb-1">Counselling & Advice:</p>
              <ul className="list-disc pl-5">
                {e.recommendation.antiStigmaMessages?.map((m: string, i: number) => <li key={i}>{m}</li>)}
                {e.recommendation.safetyAdvice?.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">4. Record Attribution</h2>
          <div className="text-sm space-y-1 italic">
            <p><strong>Generated By:</strong> {e.authorName}</p>
            <p><strong>Role:</strong> {e.authorRole}</p>
            <p><strong>Facility:</strong> Regional Health Center</p>
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t">
          <div className="flex justify-between items-end">
            <div className="text-xs text-slate-400">
              <p>© 2026 AI Epilepsy Assistant Project</p>
              <p>Generated by: {e.authorName}</p>
            </div>
            <div className="text-center border-t border-slate-900 pt-2 px-10">
              <p className="text-xs font-bold uppercase">Authorized Clinician Signature</p>
            </div>
          </div>
        </footer>
      </div>
    );

    print(reportContent);
  };

  if (!patient) return <div className="p-10 text-center">Patient not found</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 text-muted-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> Records
        </Button>
        <Button onClick={() => handleDownload()} variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary/5">
          <Download className="h-4 w-4" /> Download Full History
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-headline font-bold text-primary">{patient.name}</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground italic">CHW: {patient.chwName}</p>
          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{patient.status}</Badge>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-card p-3 rounded-xl border border-muted shadow-sm">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Filter Period</span>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="h-9 border-none bg-transparent focus:ring-0 text-sm font-bold">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Full History</SelectItem>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {filteredEncounters.length > 0 ? (
          filteredEncounters.map((encounter) => {
            const isRecent = differenceInHours(new Date(), new Date(encounter.date)) < 24;
            
            return (
              <Card key={encounter.id} className="border-none shadow-md overflow-hidden bg-card/50">
                <CardHeader className="p-4 bg-muted/20 border-b">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{formatSafeDate(encounter.date)}</span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <User className="h-3 w-3" /> Author: {encounter.authorName} ({encounter.authorRole})
                      </p>
                    </div>
                    {isClinician && isRecent && (
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedEncounter(encounter); setShowOverride(true); }} className="h-8 text-[10px] font-bold text-primary uppercase">
                        <Edit3 className="h-3 w-3 mr-1" /> Override
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <section>
                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Summary</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{encounter.summary}</p>
                  </section>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9 text-[10px] font-bold uppercase tracking-widest" onClick={() => { setSelectedEncounter(encounter); setShowFullReport(true); }}>
                      <FileSearch className="h-3 w-3 mr-2" /> View Full Report
                    </Button>
                    <Button variant="ghost" size="sm" className="shrink-0 h-9" onClick={() => handleDownload(encounter)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed">
            <CalendarIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">No encounters found for this period.</p>
          </div>
        )}
      </div>

      {/* Full Report Preview Dialog */}
      <Dialog open={showFullReport} onOpenChange={setShowFullReport}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto p-0 border-none shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Clinical Encounter Report Preview</DialogTitle>
            <DialogDescription>Detailed view of the selected epilepsy clinical encounter record.</DialogDescription>
          </DialogHeader>
          {selectedEncounter && (
            <div className="bg-white p-8 text-slate-900 leading-normal" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              <div className="text-center border-b pb-6 mb-8">
                <h1 className="text-xl font-bold uppercase">Clinical Encounter Report</h1>
                <p className="text-xs font-bold text-muted-foreground mt-1 uppercase">AI Epilepsy Assistant • Confidential Record</p>
                <p className="text-[10px] mt-2">Generated: {format(new Date(), 'PPPP p')}</p>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-sm font-bold uppercase border-b pb-1 mb-3">1. Patient Profile</h2>
                  <div className="grid grid-cols-2 gap-y-1 text-xs">
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Contact:</strong> {patient.contact}</p>
                    <p><strong>Age/Sex:</strong> {patient.age}Y • {patient.gender}</p>
                    <p><strong>Author:</strong> {selectedEncounter.authorName}</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-bold uppercase border-b pb-1 mb-3">2. Clinical Findings</h2>
                  <div className="space-y-2 text-xs">
                    <p><strong>Risk Level:</strong> {selectedEncounter.recommendation.urgencyLevel} RISK</p>
                    <p><strong>Summary:</strong> {selectedEncounter.summary}</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-bold uppercase border-b pb-1 mb-3">3. Proposed Management</h2>
                  <div className="space-y-3 text-xs">
                    <p><strong>Action:</strong> {selectedEncounter.recommendation.action}</p>
                    <div>
                      <p className="underline font-bold">Clinical Advice:</p>
                      <ul className="list-disc pl-4 space-y-1 mt-1">
                        {selectedEncounter.recommendation.antiStigmaMessages?.map((m: string, i: number) => <li key={i}>{m}</li>)}
                        {selectedEncounter.recommendation.safetyAdvice?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-bold uppercase border-b pb-1 mb-3">4. Attribution</h2>
                  <div className="text-[10px] italic text-slate-500">
                    <p>Assessment performed by: {selectedEncounter.authorName} ({selectedEncounter.authorRole})</p>
                    <p>Facility: Regional Epilepsy Registry</p>
                  </div>
                </section>
              </div>

              <div className="mt-10 pt-6 border-t flex flex-col items-center">
                <Button size="sm" className="w-full bg-slate-900 text-white gap-2 h-10 no-print" onClick={() => handleDownload(selectedEncounter)}>
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Clinician Override Dialog */}
      <Dialog open={showOverride} onOpenChange={setShowOverride}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline italic text-primary">Clinician Update</DialogTitle>
            <DialogDescription>Updating CHW assessment with specialist clinical oversight notes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Assessment Author (CHW)</Label>
              <div className="p-3 bg-muted/30 rounded-xl text-xs font-bold">{selectedEncounter?.authorName}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Specialist Review Notes</Label>
              <Textarea 
                value={overrideNotes} 
                onChange={e => setOverrideNotes(e.target.value)} 
                placeholder="Add clinical findings, diagnostic plan, or titration updates..." 
                className="rounded-xl min-h-[120px] border-muted"
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full h-14 font-bold rounded-2xl shadow-lg bg-primary" disabled={!overrideNotes} onClick={handleOverrideSubmit}>
              Update & Certify Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
