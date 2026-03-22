'use client';

import { useState, Suspense, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  UserCircle,
  ShieldAlert,
  TriangleAlert,
  Loader2,
  Edit3,
  MapPin,
  Clock,
  Activity,
  Stethoscope,
  Info,
  ShieldCheck,
  ClipboardCheck,
  CheckCircle2,
  Download,
  Share2,
  X,
  FileText,
  User,
  Phone,
  Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { runClinicalLogic } from '@/lib/clinical-engine/engine';
import { Recommendation, ClinicalInput } from '@/lib/clinical-engine/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { FacilityMap } from '@/components/dashboard/facility-map';
import { usePrint } from '@/hooks/usePrint';
import { format } from 'date-fns';

type Step = 'consent' | 'patient' | 'history' | 'causes' | 'redflags' | 'assessment' | 'report' | 'final';

function NewEncounterContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { print } = usePrint();

  const [step, setStep] = useState<Step>('consent');
  const [isSaving, setIsSaving] = useState(false);
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [overrideData, setOverrideData] = useState({ reason: '', notes: '' });
  const [isApproved, setIsApproved] = useState(false);

  // Patient Data State
  const [patientData, setPatientData] = useState({
    name: '',
    dob: '',
    sex: '',
    location: '',
    contact: '',
    isPregnant: false,
    weight: ''
  });

  const [historyData, setHistoryData] = useState({
    type: '',
    semiology: [] as string[],
    duration: '',
    frequency: '',
    triggers: [] as string[],
    comorbidities: [] as string[],
  });

  const [causesData, setCausesData] = useState({
    fever: false,
    headTrauma: false,
    perinatalInsult: false,
    metabolicSuspicion: false,
    suddenOnsetNeurological: false,
  });

  const [redFlags, setRedFlags] = useState({
    repeated: false,
    feverNeck: false,
    injury: false,
    newOnsetUnder5: false,
    medicationFail: false,
    prolongedSeizure: false,
    additionalNotes: '',
  });

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const calculatedAge = useMemo(() => {
    if (!patientData.dob) return 'N/A';
    const birthYear = new Date(patientData.dob).getFullYear();
    return isNaN(birthYear) ? 'N/A' : new Date().getFullYear() - birthYear;
  }, [patientData.dob]);

  const runAssessment = () => {
    setStep('assessment');
    
    const age = typeof calculatedAge === 'number' ? calculatedAge : 30;

    const input: ClinicalInput = {
      patientProfile: { age, sex: patientData.sex, isPregnant: patientData.isPregnant, weightKg: Number(patientData.weight) },
      seizureHistory: { ...historyData, semiology: historyData.semiology, triggers: historyData.triggers, comorbidities: historyData.comorbidities },
      underlyingCauses: causesData,
      redFlags: redFlags
    };

    setTimeout(() => {
      const result = runClinicalLogic(input);
      setRecommendation(result);
      if (result.urgencyLevel === 'EMERGENCY') setShowSafetyDialog(true);
      setStep('report');
    }, 1500);
  };

  const handleApprove = () => {
    setIsApproved(true);
    setStep('final');
    toast({ title: "Recommendation Approved", description: "Generating clinical report document." });
  };

  const handleOverrideComplete = () => {
    setShowOverrideDialog(false);
    setIsApproved(true);
    setStep('final');
    toast({ title: "Override Logged", description: "Final clinical report generated with discordance notes." });
  };

  const handleDownload = () => {
    const reportHtml = document.getElementById('clinical-report-content');
    if (reportHtml) {
      print(<div className="report-print-container" dangerouslySetInnerHTML={{ __html: reportHtml.innerHTML }} />);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Clinical Report - ${patientData.name}`,
        text: `Clinical assessment for ${patientData.name} performed on ${format(new Date(), 'PPP')}.`,
        url: window.location.href
      }).catch(console.error);
    } else {
      toast({ title: "Sharing Not Supported", description: "Sharing is not available on this browser. Use Download instead." });
    }
  };

  const toggleItem = (list: string[], item: string, setter: any) => {
    setter((prev: any) => ({
      ...prev,
      [list as any]: prev[list as any].includes(item) 
        ? prev[list as any].filter((i: string) => i !== item)
        : [...prev[list as any], item]
    }));
  };

  const stepProgress = {
    consent: 5,
    patient: 20,
    history: 40,
    causes: 60,
    redflags: 80,
    assessment: 90,
    report: 95,
    final: 100
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      {step !== 'final' && (
        <div className="flex flex-col gap-2 sticky top-0 bg-background pt-2 z-10">
          <div className="flex justify-between items-center px-1">
            <h1 className="text-xl font-headline font-bold text-primary italic">Clinical Engine Support</h1>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">Safety Protected</Badge>
          </div>
          <Progress value={stepProgress[step]} className="h-1.5" />
        </div>
      )}

      {step === 'consent' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-headline italic">
              <ClipboardCheck className="h-5 w-5" /> Informed Consent
            </CardTitle>
            <CardDescription>Privacy & Ethics Governance (MoH Compliance)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed text-slate-700">
              <p className="font-bold mb-2">Notice to Patient/Caregiver:</p>
              "We use a digital tool to help guide management. Your medical information is encrypted and stored securely per national policy. Only authorized healthcare workers can see this data. Do you agree to proceed?"
            </div>
            <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <Checkbox id="consent" checked={hasConsent} onCheckedChange={c => setHasConsent(!!c)} />
              <Label htmlFor="consent" className="text-xs font-bold leading-tight">
                Consent obtained from patient or legal guardian.
              </Label>
            </div>
            <Button 
              className="w-full h-14 shadow-lg" 
              disabled={!hasConsent} 
              onClick={() => setStep('patient')}
            >
              Start Clinical Assessment
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'patient' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-headline italic"><UserCircle className="h-5 w-5" /> Patient Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={patientData.name} onChange={e => setPatientData({...patientData, name: e.target.value})} placeholder="Patient's name" />
            </div>
            <div className="space-y-2">
              <Label>Patient Contact</Label>
              <Input value={patientData.contact} onChange={e => setPatientData({...patientData, contact: e.target.value})} placeholder="e.g. +254 700 000 000" />
            </div>
            <div className="space-y-2">
              <Label>Location / Address</Label>
              <Input value={patientData.location} onChange={e => setPatientData({...patientData, location: e.target.value})} placeholder="Village, Town, or Landmark" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={patientData.dob} onChange={e => setPatientData({...patientData, dob: e.target.value})} /></div>
              <div className="space-y-2"><Label>Sex</Label>
                <Select value={patientData.sex} onValueChange={v => setPatientData({...patientData, sex: v})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            {patientData.sex === 'female' && (
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border border-dashed">
                <Checkbox id="pregnant" checked={patientData.isPregnant} onCheckedChange={c => setPatientData({...patientData, isPregnant: !!c})} />
                <Label htmlFor="pregnant" className="text-xs font-bold leading-relaxed">Currently Pregnant? (High Risk)</Label>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('consent')}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-1 shadow-md" onClick={() => setStep('history')}>Next <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'history' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-headline italic"><Activity className="h-5 w-5" /> Structured History</CardTitle>
            <CardDescription>Semiology & classification per WHO guidelines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Seizure Type Classification</Label>
              <Select value={historyData.type} onValueChange={v => setHistoryData({...historyData, type: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="convulsive">Convulsive (Generalized)</SelectItem>
                  <SelectItem value="non-convulsive">Non-convulsive (Focal/Absence)</SelectItem>
                  <SelectItem value="uncertain">Uncertain / Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Semiology (Observed Signs)</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Motor Jerking', 'Stiffness', 'Loss of Awareness', 'Incontinence', 'Tongue Biting'].map(s => (
                  <Button key={s} type="button" variant={historyData.semiology.includes(s) ? 'default' : 'outline'} size="sm" className="h-8 text-[10px] uppercase font-bold" onClick={() => toggleItem('semiology', s, setHistoryData)}>{s}</Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="flex items-center gap-1"><Clock className="h-3 w-3" /> Duration (min)</Label><Input type="number" value={historyData.duration} onChange={e => setHistoryData({...historyData, duration: e.target.value})} placeholder="Min" /></div>
              <div className="space-y-2"><Label>Freq (/month)</Label><Input type="number" value={historyData.frequency} onChange={e => setHistoryData({...historyData, frequency: e.target.value})} placeholder="e.g. 2" /></div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep('patient')}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-1 shadow-md" onClick={() => setStep('causes')}>Next <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'causes' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-headline italic"><Stethoscope className="h-5 w-5" /> Underlying Causes</CardTitle>
            <CardDescription>Explore secondary causes per technical brief.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'fever', label: 'Current Fever (Suspected Infection)' },
              { id: 'headTrauma', label: 'History of Severe Head Trauma' },
              { id: 'perinatalInsult', label: 'Perinatal/Birth Insult history' },
              { id: 'metabolicSuspicion', label: 'Metabolic (e.g., severe malnutrition)' },
              { id: 'suddenOnsetNeurological', label: 'Sudden weakness/speech loss' }
            ].map(cause => (
              <div key={cause.id} className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <Checkbox id={cause.id} checked={causesData[cause.id as keyof typeof causesData]} onCheckedChange={c => setCausesData({...causesData, [cause.id]: !!c})} />
                <Label htmlFor={cause.id} className="text-xs font-bold leading-relaxed">{cause.label}</Label>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep('history')}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-1 shadow-md" onClick={() => setStep('redflags')}>Next <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'redflags' && (
        <Card className="border-none shadow-sm">
          <CardHeader><CardTitle className="text-lg text-red-600 flex gap-2 font-headline italic"><ShieldAlert /> WHO Red Flags</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'prolongedSeizure', label: 'Ongoing seizure > 5 mins (STATUS)' },
              { id: 'repeated', label: 'Repeated seizures without recovery' },
              { id: 'feverNeck', label: 'Fever & Neck Stiffness (Meningitis)' },
              { id: 'medicationFail', label: 'Failing first-line medicines' }
            ].map(flag => (
              <div key={flag.id} className="flex items-center space-x-3 p-3 bg-red-50/20 rounded-lg border border-red-100">
                <Checkbox id={flag.id} checked={redFlags[flag.id as keyof typeof redFlags] === true} onCheckedChange={c => setRedFlags({...redFlags, [flag.id]: !!c})} />
                <Label htmlFor={flag.id} className="text-xs font-bold leading-relaxed">{flag.label}</Label>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep('causes')}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 font-bold shadow-lg" onClick={runAssessment}>Assess Risk Profile</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'assessment' && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="text-xl font-bold font-headline text-primary italic">Applying the Clinical Engine Assistant</h3>
          <p className="text-sm text-muted-foreground">Decision authority remains with the healthcare worker.</p>
        </div>
      )}

      {step === 'report' && recommendation && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-headline italic">Suggested Management</CardTitle>
                <Badge variant={recommendation.urgencyLevel === 'EMERGENCY' ? 'destructive' : 'secondary'} className="uppercase font-bold tracking-widest text-[10px]">
                  {recommendation.urgencyLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {/* Patient Quick Info */}
              <div className="p-4 bg-muted/20 grid grid-cols-2 gap-4">
                <div><Label className="text-[10px] uppercase text-muted-foreground">Patient</Label><p className="text-sm font-bold">{patientData.name}</p></div>
                <div><Label className="text-[10px] uppercase text-muted-foreground">Age / Sex</Label><p className="text-sm font-bold">{calculatedAge}Y • {patientData.sex}</p></div>
              </div>

              <div className="p-4 space-y-4">
                <section>
                  <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Proposed Action</h4>
                  <p className="text-sm font-bold text-primary leading-tight">{recommendation.action}</p>
                </section>
                
                <section className="bg-primary/5 p-3 rounded-lg border border-dashed border-primary/20">
                  <h4 className="text-[10px] font-bold uppercase text-primary flex items-center gap-1 mb-2"><Info className="h-3 w-3" /> Anti-Stigma Counseling</h4>
                  <ul className="space-y-1.5">
                    {recommendation.antiStigmaMessages.map((m, i) => (
                      <li key={i} className="text-xs font-medium text-slate-700 flex items-start gap-2"><div className="h-1 w-1 bg-primary rounded-full mt-1.5" /> {m}</li>
                    ))}
                  </ul>
                </section>

                <section className="bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                  <h4 className="text-[10px] font-bold uppercase text-orange-700 flex items-center gap-1 mb-2"><ShieldCheck className="h-3 w-3" /> Safety Advice</h4>
                  <ul className="space-y-1">
                    {recommendation.safetyAdvice.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-xs font-medium text-orange-950 flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-orange-400" /> {s}</li>
                    ))}
                  </ul>
                </section>
              </div>

              {recommendation.urgencyLevel !== 'STABLE' && (
                <div className="p-4 bg-muted/5">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <MapPin className="h-4 w-4" />
                    <h3 className="text-[10px] font-bold uppercase tracking-tight italic">Recommended Referral Pathway</h3>
                  </div>
                  <FacilityMap urgency={recommendation.urgencyLevel} patientLocation={patientData.location} />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button className="w-full h-14 font-bold shadow-lg bg-primary text-white" onClick={handleApprove}>
              <CheckCircle2 className="mr-2" /> Approve Recommendation
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={() => setShowOverrideDialog(true)}>
              <Edit3 className="h-4 w-4 mr-2" /> Clinical Override
            </Button>
          </div>
        </div>
      )}

      {step === 'final' && recommendation && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-20">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-headline font-bold text-primary italic">Final Report</h2>
            <Badge className="bg-green-600">CERTIFIED</Badge>
          </div>

          {/* SIMPLIFIED WORD-DOC STYLE REPORT PREVIEW */}
          <div id="clinical-report-content" className="bg-white p-8 border shadow-sm min-h-[600px] text-slate-900 font-serif leading-normal">
            <div className="text-center border-b pb-6 mb-8">
              <h1 className="text-2xl font-bold uppercase tracking-tight">Clinical Encounter Report</h1>
              <p className="text-sm font-bold text-muted-foreground mt-1 uppercase">AI Epilepsy Assistant • Confidential Patient Record</p>
              <p className="text-xs mt-2">Date: {format(new Date(), 'PPPP p')}</p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">1. Patient Demographics</h2>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p><strong>Full Name:</strong> {patientData.name}</p>
                  <p><strong>Contact:</strong> {patientData.contact}</p>
                  <p><strong>Age / Sex:</strong> {calculatedAge}Y • {patientData.sex}</p>
                  <p><strong>Address/Location:</strong> {patientData.location}</p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">2. Clinical Suggestion</h2>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Flag:</strong> {recommendation.urgencyLevel} RISK</p>
                  <p className="text-sm"><strong>Suggested Action:</strong> {recommendation.action}</p>
                  {isApproved && overrideData.reason && (
                    <div className="mt-4 p-4 border border-slate-200 bg-slate-50 italic text-sm">
                      <p className="font-bold not-italic underline mb-1 uppercase text-xs">Clinician Discordance Note:</p>
                      "{overrideData.notes}"
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">3. Management Details</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold underline mb-2">Counselling Points</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {recommendation.antiStigmaMessages.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold underline mb-2">Safety Advice</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {recommendation.safetyAdvice.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">4. Recommended Referral</h2>
                <div className="text-sm">
                  <p><strong>Facility:</strong> {recommendation.referralDestination}</p>
                  <p className="mt-1"><strong>Pathway Detail:</strong> Kenyatta University Teaching, Referral and Research Hospital (KUTRRH)</p>
                </div>
              </section>

              <div className="mt-12 pt-8 border-t text-center text-[10px] text-slate-400 italic">
                <p>This document was generated by the AI Clinical Engine Assistant for authorized healthcare personnel only.</p>
                <p>© 2026 AI Epilepsy Assistant</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button className="h-12 font-bold bg-primary text-white" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            <Button variant="outline" className="h-12 font-bold" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share Report</Button>
            <Button variant="ghost" className="col-span-2 h-12 text-muted-foreground font-bold" onClick={() => router.push('/dashboard')}><X className="mr-2 h-4 w-4" /> Dismiss</Button>
          </div>
        </div>
      )}

      {/* Override Dialog */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline italic text-primary">Clinical Decision Override</DialogTitle>
            <DialogDescription>Documenting clinical discordance for quality and safety audit loops.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Reason for Discordance</Label>
              <Select onValueChange={v => setOverrideData({...overrideData, reason: v})}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="context">AI missed clinical context/history</SelectItem>
                  <SelectItem value="protocol">Local MoH protocol variation</SelectItem>
                  <SelectItem value="judgment">Expert clinical judgment (Human-in-loop)</SelectItem>
                  <SelectItem value="stigma">Patient/Caregiver reluctance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Clinical Justification Notes</Label>
              <Textarea 
                value={overrideData.notes} 
                onChange={e => setOverrideData({...overrideData, notes: e.target.value})} 
                placeholder="Describe your reasoning..." 
                className="rounded-xl min-h-[100px] border-muted"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" className="w-full h-14 font-bold rounded-2xl shadow-lg" disabled={!overrideData.reason} onClick={handleOverrideComplete}>
              Confirm Clinical Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safety Alert Dialog */}
      <Dialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <DialogContent className="bg-red-600 text-white border-none shadow-2xl">
          <DialogHeader><div className="mx-auto bg-white/20 p-3 rounded-full mb-2"><TriangleAlert className="h-10 w-10 text-white animate-pulse" /></div><DialogTitle className="text-2xl font-bold text-center">EMERGENCY PROTOCOL</DialogTitle></DialogHeader>
          <p className="text-center text-lg leading-relaxed">
            <strong>STATUS EPILEPTICUS RISK</strong>. 
            Immediate specialist intervention and facility referral required. Proceed with high-tier hospital transport immediately.
          </p>
          <DialogFooter><Button onClick={() => setShowSafetyDialog(false)} className="w-full h-14 bg-white text-red-600 font-bold hover:bg-white/90">I ACKNOWLEDGE EMERGENCY</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewEncounterPage() { return <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}><NewEncounterContent /></Suspense>; }
