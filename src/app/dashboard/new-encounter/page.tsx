'use client';

import { useState, useEffect, Suspense } from 'react';
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
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  FileText,
  UserCircle,
  ShieldAlert,
  TriangleAlert,
  Loader2,
  Edit3,
  MapPin,
  Clock,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useFirestore, useUser, useDoc } from '@/firebase';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { FacilityMap } from '@/components/dashboard/facility-map';

type Step = 'patient' | 'history' | 'redflags' | 'assessment' | 'report';

function NewEncounterContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  const startAt = searchParams.get('startAt');

  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('patient');
  const [isSaving, setIsSaving] = useState(false);
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [overrideData, setOverrideData] = useState({ reason: '', notes: '' });

  const { data: existingPatient } = useDoc(patientId ? doc(db, 'patients', patientId) : null);
  const { data: profile } = useDoc(user ? doc(db, 'users', user.uid) : null);

  // Form State
  const [patientData, setPatientData] = useState({
    name: '',
    dob: '',
    sex: '',
    location: '',
    contact: '',
    isPregnant: false,
  });

  const [historyData, setHistoryData] = useState({
    type: '',
    duration: '',
    frequency: '',
    triggers: [] as string[],
  });

  const [redFlags, setRedFlags] = useState({
    repeated: false,
    feverNeck: false,
    injury: false,
    newOnsetUnder5: false,
    medicationFail: false,
    additionalNotes: '',
  });

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    if (existingPatient) {
      setPatientData({
        name: existingPatient.name,
        dob: existingPatient.dob || '',
        sex: existingPatient.gender.toLowerCase(),
        location: existingPatient.location,
        contact: existingPatient.contact || '',
        isPregnant: false,
      });
      if (startAt === 'redflags') setStep('redflags');
      else setStep('history');
    }
  }, [existingPatient, startAt]);

  const runAssessment = () => {
    setStep('assessment');
    
    // Calculate approximate age from DOB for clinical logic
    const birthYear = new Date(patientData.dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = isNaN(birthYear) ? 30 : currentYear - birthYear;

    const input: ClinicalInput = {
      patientProfile: { age, sex: patientData.sex },
      seizureHistory: historyData,
      redFlags: redFlags
    };

    setTimeout(() => {
      const result = runClinicalLogic(input);
      setRecommendation(result);
      if (result.urgencyLevel === 'EMERGENCY') setShowSafetyDialog(true);
      setStep('report');
    }, 1500);
  };

  const saveRecord = (status: 'approved' | 'overridden') => {
    if (!user || !db || !recommendation) return;
    setIsSaving(true);

    const targetPatientId = patientId || doc(collection(db, 'patients')).id;
    const patientRef = doc(db, 'patients', targetPatientId);
    
    // Calculate Age for list view display
    const birthYear = new Date(patientData.dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = isNaN(birthYear) ? 30 : currentYear - birthYear;

    const patientUpdate = {
      id: targetPatientId,
      name: patientData.name,
      dob: patientData.dob,
      age: age,
      gender: patientData.sex,
      location: patientData.location,
      contact: patientData.contact,
      status: recommendation.urgencyLevel === 'EMERGENCY' ? 'Urgent' : recommendation.urgencyLevel === 'URGENT' ? 'Urgent' : 'Stable',
      chwId: user.uid,
      updatedAt: serverTimestamp(),
    };

    setDoc(patientRef, patientUpdate, { merge: true });

    const encounterId = doc(collection(db, 'encounters')).id;
    const encounterRef = doc(db, 'patients', targetPatientId, 'encounters', encounterId);
    
    const encounterData = {
      id: encounterId,
      patientId: targetPatientId,
      chwId: user.uid,
      date: new Date().toISOString(),
      summary: `Assessment. Seizure type: ${historyData.type}. Duration: ${historyData.duration}m. Frequency: ${historyData.frequency}/mo. Notes: ${redFlags.additionalNotes}`,
      history: historyData,
      redFlags: Object.keys(redFlags).filter(k => redFlags[k as keyof typeof redFlags] === true),
      recommendation: recommendation,
      status: status,
      overrideReason: status === 'overridden' ? overrideData.reason : null,
      overrideNotes: status === 'overridden' ? overrideData.notes : null,
      editedBy: { uid: user.uid, role: profile?.role, name: profile?.firstName },
      createdAt: serverTimestamp(),
    };

    setDoc(encounterRef, encounterData)
      .then(() => {
        toast({ title: "Clinical Record Logged", description: status === 'overridden' ? "Safety override captured for audit." : "Standard record synced." });
        setShowOverrideDialog(false);
        router.push('/dashboard');
      })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: encounterRef.path,
          operation: 'create',
          requestResourceData: encounterData
        }));
      })
      .finally(() => setIsSaving(false));
  };

  const handleTriggerToggle = (trigger: string) => {
    setHistoryData(prev => ({
      ...prev,
      triggers: prev.triggers.includes(trigger) 
        ? prev.triggers.filter(t => t !== trigger)
        : [...prev.triggers, trigger]
    }));
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-headline font-bold text-primary">Clinical Assessment</h1>
        <Progress value={step === 'patient' ? 20 : step === 'history' ? 40 : step === 'redflags' ? 60 : 80} className="h-2" />
      </div>

      {step === 'patient' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary" /> Patient Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={patientData.name} onChange={e => setPatientData({...patientData, name: e.target.value})} placeholder="Patient's name" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={patientData.dob} onChange={e => setPatientData({...patientData, dob: e.target.value})} /></div>
              <div className="space-y-2">
                <Label>Sex</Label>
                <Select value={patientData.sex} onValueChange={v => setPatientData({...patientData, sex: v})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Village / Sector</Label><Input value={patientData.location} onChange={e => setPatientData({...patientData, location: e.target.value})} placeholder="e.g. Kijiji Village" /></div>
            <div className="space-y-2"><Label>Contact Number</Label><Input value={patientData.contact} onChange={e => setPatientData({...patientData, contact: e.target.value})} placeholder="+254..." /></div>
            <Button className="w-full h-12" onClick={() => setStep('history')}>Next <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      )}

      {step === 'history' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Seizure History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Seizure Type</Label>
              <Select value={historyData.type} onValueChange={v => setHistoryData({...historyData, type: v})}>
                <SelectTrigger><SelectValue placeholder="Select classification" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="generalized">Generalized (Tonic-Clonic)</SelectItem>
                  <SelectItem value="focal">Focal (Partial)</SelectItem>
                  <SelectItem value="absence">Absence</SelectItem>
                  <SelectItem value="unknown">Unknown / Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Clock className="h-3 w-3" /> Duration (min)</Label>
                <Input type="number" value={historyData.duration} onChange={e => setHistoryData({...historyData, duration: e.target.value})} placeholder="Minutes" />
              </div>
              <div className="space-y-2">
                <Label>Freq (per month)</Label>
                <Input type="number" value={historyData.frequency} onChange={e => setHistoryData({...historyData, frequency: e.target.value})} placeholder="e.g. 3" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Known Triggers</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Stress', 'Fever', 'Missed Meds', 'Alcohol', 'Sleep Deprivation', 'Lights'].map(t => (
                  <Button 
                    key={t} 
                    type="button"
                    variant={historyData.triggers.includes(t) ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-[10px] uppercase font-bold"
                    onClick={() => handleTriggerToggle(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep('patient')}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-1" onClick={() => setStep('redflags')}>Next <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'redflags' && (
        <Card className="border-none shadow-sm">
          <CardHeader><CardTitle className="text-lg text-red-600 flex gap-2"><ShieldAlert /> Red Flags</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2">Check all that apply</p>
            {[
              { id: 'repeated', label: 'Repeated seizures (Status Risk)' },
              { id: 'feverNeck', label: 'Fever & Neck Stiffness' },
              { id: 'injury', label: 'Severe Injury sustained' },
              { id: 'medicationFail', label: 'Failing standard medication' }
            ].map(flag => (
              <div key={flag.id} className="flex items-center space-x-3 p-3 bg-red-50/20 rounded-lg border border-red-100/50">
                <Checkbox id={flag.id} checked={redFlags[flag.id as keyof typeof redFlags] === true} onCheckedChange={c => setRedFlags({...redFlags, [flag.id]: !!c})} />
                <Label htmlFor={flag.id} className="text-xs font-bold leading-relaxed">{flag.label}</Label>
              </div>
            ))}
            <div className="space-y-2 pt-2">
              <Label>Additional Observations</Label>
              <Textarea placeholder="Any other clinical notes..." value={redFlags.additionalNotes} onChange={e => setRedFlags({...redFlags, additionalNotes: e.target.value})} />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep('history')}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-1 bg-primary font-bold" onClick={runAssessment}>Assess Patient</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'assessment' && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="text-xl font-bold font-headline text-primary">On-Device Clinical Logic Active</h3>
          <p className="text-sm text-muted-foreground">Running WHO epilepsy protocols...</p>
        </div>
      )}

      {step === 'report' && recommendation && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className={recommendation.urgencyLevel === 'EMERGENCY' ? "bg-red-50 border-red-200" : recommendation.urgencyLevel === 'URGENT' ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Badge variant={recommendation.urgencyLevel === 'EMERGENCY' ? 'destructive' : 'secondary'}>{recommendation.urgencyLevel}</Badge>
                <Sparkles className="h-4 w-4 text-primary/40" />
              </div>
              <CardTitle className="text-xl mt-2">AI Triage Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section><h4 className="text-[10px] font-bold uppercase text-muted-foreground">Reasoning</h4><p className="text-sm">{recommendation.clinicalReasoning}</p></section>
              <section><h4 className="text-[10px] font-bold uppercase text-muted-foreground">Action</h4><p className="text-sm font-bold text-primary">{recommendation.action}</p></section>
            </CardContent>
          </Card>

          {recommendation.urgencyLevel !== 'STABLE' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold font-headline text-primary uppercase tracking-tight">Nearest Capable Facility (GIS)</h3>
              </div>
              <FacilityMap urgency={recommendation.urgencyLevel} patientLocation={patientData.location} />
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button className="w-full h-14 font-bold shadow-lg" onClick={() => saveRecord('approved')} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />} Accept & Sync
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={() => setShowOverrideDialog(true)}>
              <Edit3 className="h-4 w-4 mr-2" /> Clinical Override
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Clinical Override Reason</DialogTitle><DialogDescription>All overrides are logged for safety audit and AI improvement.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Primary Reason</Label>
              <Select onValueChange={v => setOverrideData({...overrideData, reason: v})}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="context">AI missed clinical context</SelectItem>
                  <SelectItem value="protocol">Local protocol variation</SelectItem>
                  <SelectItem value="judgment">Expert clinical judgment</SelectItem>
                  <SelectItem value="error">Erroneous AI detection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Detailed Notes</Label><Textarea value={overrideData.notes} onChange={e => setOverrideData({...overrideData, notes: e.target.value})} placeholder="Provide context for the override..." /></div>
          </div>
          <DialogFooter><Button variant="destructive" className="w-full h-12 font-bold" disabled={!overrideData.reason || isSaving} onClick={() => saveRecord('overridden')}>
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : null} Confirm Override
          </Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <DialogContent className="bg-red-600 text-white border-none shadow-2xl">
          <DialogHeader><div className="mx-auto bg-white/20 p-3 rounded-full mb-2"><TriangleAlert className="h-10 w-10 text-white animate-pulse" /></div><DialogTitle className="text-2xl font-bold text-center">SAFETY ALERT</DialogTitle></DialogHeader>
          <p className="text-center text-lg leading-relaxed">Patient exhibits <strong>EMERGENCY RED FLAGS</strong>. Immediate specialist intervention and facility referral required.</p>
          <DialogFooter><Button onClick={() => setShowSafetyDialog(false)} className="w-full h-14 bg-white text-red-600 font-bold hover:bg-white/90">I ACKNOWLEDGE</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewEncounterPage() { return <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}><NewEncounterContent /></Suspense>; }
