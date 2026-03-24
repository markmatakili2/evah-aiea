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
  TriangleAlert,
  Loader2,
  Edit3,
  MapPin,
  Clock,
  Activity,
  Stethoscope,
  Info,
  ClipboardCheck,
  CheckCircle2,
  Download,
  X,
  AlertTriangle,
  ShieldAlert
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
import { mockUserProfile } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type Step = 'consent' | 'patient' | 'history' | 'causes' | 'assessment' | 'report' | 'final';

function NewEncounterContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { print } = usePrint();

  const [step, setStep] = useState<Step>('consent');
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
    isRepeated: false,
    triggers: [] as string[],
    comorbidities: [] as string[],
  });

  const [causesData, setCausesData] = useState({
    fever: false,
    headTrauma: false,
    perinatalInsult: false,
    metabolicSuspicion: false,
    suddenOnsetNeurological: false,
    neckStiffness: false,
  });

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const calculatedAge = useMemo(() => {
    if (!patientData.dob) return 30;
    const birthDate = new Date(patientData.dob);
    if (isNaN(birthDate.getTime())) return 30;
    return new Date().getFullYear() - birthDate.getFullYear();
  }, [patientData.dob]);

  const runAssessment = () => {
    setStep('assessment');
    
    const input: ClinicalInput = {
      patientProfile: { age: calculatedAge, sex: patientData.sex, isPregnant: patientData.isPregnant, weightKg: Number(patientData.weight) },
      seizureHistory: historyData,
      underlyingCauses: causesData,
      redFlags: {
        repeated: historyData.isRepeated,
        feverNeck: causesData.fever && causesData.neckStiffness,
        injury: false,
        newOnsetUnder5: calculatedAge < 5,
        medicationFail: false,
        isPregnant: patientData.isPregnant,
        prolongedSeizure: Number(historyData.duration) >= 5
      }
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
    patient: 25,
    history: 50,
    causes: 75,
    assessment: 90,
    report: 95,
    final: 100
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      {step !== 'final' && (
        <div className="flex flex-col gap-2 sticky top-0 bg-background pt-2 z-10">
          <div className="flex justify-between items-center px-1">
            <h1 className="text-xl font-headline font-bold text-primary italic">Clinical Engine</h1>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">AI Protocol Analysis</Badge>
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
              "We use a digital tool to help guide management. Your medical information is encrypted and stored securely per national policy. Do you agree to proceed?"
            </div>
            <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <Checkbox id="consent" checked={hasConsent} onCheckedChange={c => setHasConsent(!!c)} />
              <Label htmlFor="consent" className="text-xs font-bold leading-tight">
                Consent obtained from patient or legal guardian.
              </Label>
            </div>
            <Button className="w-full h-14 shadow-lg" disabled={!hasConsent} onClick={() => setStep('patient')}>Start Assessment</Button>
          </CardContent>
        </Card>
      )}

      {step === 'patient' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-headline italic"><UserCircle className="h-5 w-5" /> Patient Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={patientData.name} onChange={e => setPatientData({...patientData, name: e.target.value})} placeholder="Patient's name" /></div>
            <div className="space-y-2"><Label>Location / Address</Label><Input value={patientData.location} onChange={e => setPatientData({...patientData, location: e.target.value})} placeholder="Village or Sector" /></div>
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
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-headline italic"><Activity className="h-5 w-5" /> Seizure History</CardTitle>
            <CardDescription>Structured semiology per WHO guidelines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Seizure Type</Label>
              <Select value={historyData.type} onValueChange={v => setHistoryData({...historyData, type: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="convulsive">Convulsive (Generalized)</SelectItem>
                  <SelectItem value="non-convulsive">Non-convulsive (Focal/Absence)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Semiology (Signs)</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Motor Jerking', 'Stiffness', 'Loss of Awareness', 'Tongue Biting'].map(s => (
                  <Button key={s} type="button" variant={historyData.semiology.includes(s) ? 'default' : 'outline'} size="sm" className="h-8 text-[10px] uppercase font-bold" onClick={() => toggleItem('semiology', s, setHistoryData)}>{s}</Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="flex items-center gap-1"><Clock className="h-3 w-3" /> Duration (min)</Label><Input type="number" value={historyData.duration} onChange={e => setHistoryData({...historyData, duration: e.target.value})} placeholder="Min" /></div>
              <div className="space-y-2"><Label>Freq (/month)</Label><Input type="number" value={historyData.frequency} onChange={e => setHistoryData({...historyData, frequency: e.target.value})} placeholder="e.g. 2" /></div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border border-dashed">
              <Checkbox id="repeated" checked={historyData.isRepeated} onCheckedChange={c => setHistoryData({...historyData, isRepeated: !!c})} />
              <Label htmlFor="repeated" className="text-xs font-bold leading-relaxed">Repeated seizures without recovery?</Label>
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
            <CardDescription>Secondary causes for risk analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'fever', label: 'Current Fever (Suspected Infection)' },
              { id: 'neckStiffness', label: 'Neck Stiffness (Meningitis sign)' },
              { id: 'headTrauma', label: 'History of Severe Head Trauma' },
              { id: 'perinatalInsult', label: 'Perinatal/Birth Insult history' },
              { id: 'suddenOnsetNeurological', label: 'Sudden weakness/speech loss' }
            ].map(cause => (
              <div key={cause.id} className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <Checkbox id={cause.id} checked={(causesData as any)[cause.id]} onCheckedChange={c => setCausesData({...causesData, [cause.id]: !!c})} />
                <Label htmlFor={cause.id} className="text-xs font-bold leading-relaxed">{cause.label}</Label>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep('history')}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg" onClick={runAssessment}>Run AI Risk Analysis</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'assessment' && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="text-xl font-bold font-headline text-primary italic">Analyzing Clinical Inputs...</h3>
          <p className="text-sm text-muted-foreground">Mapping data to WHO mhGAP emergency protocols.</p>
        </div>
      )}

      {step === 'report' && recommendation && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className={recommendation.urgencyLevel === 'EMERGENCY' ? "bg-red-600 text-white" : "bg-primary text-primary-foreground"}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-headline italic">Clinical Suggestion</CardTitle>
                <Badge variant="secondary" className="uppercase font-bold tracking-widest text-[10px]">
                  {recommendation.urgencyLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {recommendation.detectedRedFlags.length > 0 && (
                <div className="p-4 bg-red-50 border-l-4 border-red-600">
                  <div className="flex items-center gap-2 mb-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Emergency Triggers</h4>
                  </div>
                  <ul className="space-y-1">
                    {recommendation.detectedRedFlags.map((flag, i) => (
                      <li key={i} className="text-xs font-bold text-red-900">• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 space-y-5">
                <section>
                  <Label className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">1. Urgency Level</Label>
                  <p className={cn("text-lg font-bold mt-1", recommendation.urgencyLevel === 'EMERGENCY' ? "text-red-600" : "text-primary")}>{recommendation.urgencyLevel}</p>
                </section>

                <section>
                  <Label className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">2. Action ({recommendation.action})</Label>
                  <p className="text-sm font-bold text-slate-800 leading-tight mt-1">{recommendation.actionDescription}</p>
                </section>

                <section>
                  <Label className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">3. Personalized Follow-up Plan</Label>
                  <div className="bg-muted/30 p-3 rounded-lg mt-1 border border-dashed">
                    <p className="text-sm font-medium text-slate-700 italic">"{recommendation.followUpPlan}"</p>
                  </div>
                </section>
                
                <section className="bg-primary/5 p-3 rounded-lg border border-dashed border-primary/20">
                  <Label className="text-[10px] uppercase text-primary tracking-widest font-bold flex items-center gap-1 mb-2"><Info className="h-3 w-3" /> 4. Counseling & Safety Warnings</Label>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Counseling Points</h5>
                      <ul className="space-y-1">
                        {recommendation.counselingPoints.map((m, i) => (
                          <li key={i} className="text-xs font-medium text-slate-700 flex items-start gap-2"><div className="h-1 w-1 bg-primary rounded-full mt-1.5 shrink-0" /> {m}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-[9px] font-bold text-red-600 uppercase mb-1">Safety Warnings</h5>
                      <ul className="space-y-1">
                        {recommendation.safetyWarnings.map((m, i) => (
                          <li key={i} className="text-xs font-bold text-red-900 flex items-start gap-2"><div className="h-1 w-1 bg-red-600 rounded-full mt-1.5 shrink-0" /> {m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              </div>

              {recommendation.urgencyLevel !== 'ROUTINE' && (
                <div className="p-4 bg-muted/5">
                  <div className="flex items-center gap-2 mb-3 text-primary"><MapPin className="h-4 w-4" /><h3 className="text-[10px] font-bold uppercase tracking-tight italic">Recommended Referral Pathway</h3></div>
                  <FacilityMap urgency={recommendation.urgencyLevel} patientLocation={patientData.location} />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button className="w-full h-14 font-bold shadow-lg bg-primary text-white" onClick={handleApprove}><CheckCircle2 className="mr-2" /> Approve Recommendation</Button>
            <Button variant="outline" className="w-full h-12" onClick={() => setShowOverrideDialog(true)}><Edit3 className="h-4 w-4 mr-2" /> Clinical Override</Button>
          </div>
        </div>
      )}

      {step === 'final' && recommendation && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-20">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-headline font-bold text-primary italic">Final Report</h2>
            <Badge className="bg-green-600">CERTIFIED</Badge>
          </div>

          <div id="clinical-report-content" className="bg-white p-8 border shadow-sm min-h-[600px] text-slate-900 leading-normal" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <div className="text-center border-b pb-6 mb-8">
              <h1 className="text-2xl font-bold uppercase tracking-tight">Clinical Encounter Report</h1>
              <p className="text-sm font-bold text-muted-foreground mt-1 uppercase">AI Epilepsy Assistant • Confidential Record</p>
              <p className="text-xs mt-2">Date: {format(new Date(), 'PPPP p')}</p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">1. Patient Profile</h2>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p><strong>Full Name:</strong> {patientData.name}</p>
                  <p><strong>Age / Sex:</strong> {calculatedAge}Y • {patientData.sex}</p>
                  <p><strong>Address:</strong> {patientData.location}</p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">2. Clinical Findings</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 text-sm">
                    <p><strong>Urgency Level:</strong> {recommendation.urgencyLevel}</p>
                    <p><strong>Action Type:</strong> {recommendation.action}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border rounded text-sm italic">
                    <p><strong>Action Description:</strong> {recommendation.actionDescription}</p>
                  </div>
                  {recommendation.detectedRedFlags.length > 0 && (
                    <div className="bg-red-50 p-3 border border-red-100 rounded">
                      <p className="text-xs font-bold text-red-600 uppercase mb-1 underline">Emergency Triggers Detected:</p>
                      <ul className="list-disc pl-5 text-sm font-bold text-red-900">
                        {recommendation.detectedRedFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">3. Follow-up Plan</h2>
                <p className="text-sm font-bold italic">"{recommendation.followUpPlan}"</p>
              </section>

              <section>
                <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">4. Counseling & Safety</h2>
                <div className="grid grid-cols-1 gap-4 text-xs">
                  <div>
                    <p className="font-bold underline mb-1 uppercase">Counselling Points:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {recommendation.counselingPoints.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold underline mb-1 uppercase text-red-600">Safety Warnings:</p>
                    <ul className="list-disc pl-5 space-y-1 text-red-900 font-bold">
                      {recommendation.safetyWarnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
              </section>

              {overrideData.reason && (
                <section className="bg-red-50/50 p-4 border border-red-100 rounded-lg">
                  <h2 className="text-base font-bold uppercase border-b border-red-200 pb-1 mb-4 text-red-800">5. Clinical Discordance (Override)</h2>
                  <div className="space-y-2 text-sm italic text-red-900">
                    <p><strong>Reason:</strong> {
                      overrideData.reason === 'context' ? 'AI missed clinical context' :
                      overrideData.reason === 'protocol' ? 'Local protocol variation' :
                      'Expert clinical judgment'
                    }</p>
                    <p><strong>Justification:</strong> {overrideData.notes}</p>
                  </div>
                </section>
              )}

              <section className="pt-10">
                <h2 className="text-base font-bold uppercase border-b pb-1 mb-4">Record Attribution</h2>
                <div className="text-sm space-y-1 italic">
                  <p><strong>Author:</strong> {mockUserProfile.name}</p>
                  <p><strong>Role:</strong> {mockUserProfile.role.toUpperCase()}</p>
                  <p><strong>Sector:</strong> {mockUserProfile.location}</p>
                </div>
              </section>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button className="h-12 font-bold bg-primary text-white" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            <Button variant="ghost" className="col-span-2 h-12 text-muted-foreground font-bold" onClick={() => router.push('/dashboard')}><X className="mr-2 h-4 w-4" /> Dismiss</Button>
          </div>
        </div>
      )}

      {/* Override Dialog */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline italic text-primary">Clinical Decision Override</DialogTitle>
            <DialogDescription>Documenting clinical discordance for quality audit.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Reason</Label>
              <Select onValueChange={v => setOverrideData({...overrideData, reason: v})}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="context">AI missed clinical context</SelectItem>
                  <SelectItem value="protocol">Local protocol variation</SelectItem>
                  <SelectItem value="judgment">Expert clinical judgment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Justification Notes</Label>
              <Textarea value={overrideData.notes} onChange={e => setOverrideData({...overrideData, notes: e.target.value})} placeholder="Describe reasoning..." className="rounded-xl min-h-[100px]" />
            </div>
          </div>
          <DialogFooter><Button variant="destructive" className="w-full h-14 font-bold rounded-2xl" disabled={!overrideData.reason} onClick={handleOverrideComplete}>Confirm Override</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safety Alert Dialog */}
      <Dialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <DialogContent className="bg-red-600 text-white border-none shadow-2xl">
          <DialogHeader>
            <div className="mx-auto bg-white/20 p-3 rounded-full mb-2"><ShieldAlert className="h-10 w-10 text-white animate-pulse" /></div>
            <DialogTitle className="text-2xl font-bold text-center">EMERGENCY PROTOCOL</DialogTitle>
            <DialogDescription className="sr-only">Safety alert for status epilepticus risk.</DialogDescription>
          </DialogHeader>
          <p className="text-center text-lg leading-relaxed"><strong>STATUS EPILEPTICUS RISK</strong>. Immediate specialist intervention and facility referral required per national protocol.</p>
          <DialogFooter><Button onClick={() => setShowSafetyDialog(false)} className="w-full h-14 bg-white text-red-600 font-bold hover:bg-white/90">I ACKNOWLEDGE EMERGENCY</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewEncounterPage() { return <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}><NewEncounterContent /></Suspense>; }
