
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
  Loader2
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

  const { data: existingPatient } = useDoc(patientId ? doc(db, 'patients', patientId) : null);

  // Form State
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
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
        age: existingPatient.age.toString(),
        sex: existingPatient.gender.toLowerCase(),
        location: existingPatient.location,
        contact: existingPatient.contact || '',
        isPregnant: false,
      });
      if (startAt === 'redflags') {
        setStep('redflags');
      } else {
        setStep('history');
      }
    }
  }, [existingPatient, startAt]);

  const triggers = [
    'Sleep deprivation', 'Missed medication', 'Alcohol', 
    'Fever', 'Stress', 'Flashing lights', 'Other'
  ];

  const redFlagItems = [
    { id: 'repeated', label: 'Repeated seizures without full recovery between them' },
    { id: 'feverNeck', label: 'Fever with neck stiffness/suspected meningitis or encephalitis' },
    { id: 'injury', label: 'Severe injury resulting from the seizure' },
    { id: 'newOnsetUnder5', label: 'New onset seizures in a child under 5 with fever' },
    { id: 'medicationFail', label: 'Seizures continuing despite medication at correct dose' },
  ];

  const handleNext = () => {
    if (step === 'patient') setStep('history');
    else if (step === 'history') setStep('redflags');
    else if (step === 'redflags') runAssessment();
  };

  const handleBack = () => {
    if (step === 'history') setStep('patient');
    else if (step === 'redflags') setStep('history');
  };

  const runAssessment = () => {
    setStep('assessment');
    
    const input: ClinicalInput = {
      patientProfile: {
        age: parseInt(patientData.age) || 0,
        sex: patientData.sex,
        isPregnant: patientData.isPregnant,
      },
      seizureHistory: {
        type: historyData.type,
        duration: historyData.duration,
        frequency: historyData.frequency,
        triggers: historyData.triggers,
      },
      redFlags: {
        ...redFlags,
        isPregnant: patientData.isPregnant,
      }
    };

    setTimeout(() => {
      const result = runClinicalLogic(input);
      setRecommendation(result);
      if (result.urgencyLevel === 'EMERGENCY') {
        setShowSafetyDialog(true);
      }
      setStep('report');
    }, 1500);
  };

  const handleAccept = () => {
    if (!user || !db) return;
    setIsSaving(true);

    const targetPatientId = patientId || doc(collection(db, 'patients')).id;
    const patientRef = doc(db, 'patients', targetPatientId);
    
    const patientUpdate = {
      id: targetPatientId,
      name: patientData.name,
      age: parseInt(patientData.age),
      gender: patientData.sex,
      location: patientData.location,
      contact: patientData.contact,
      status: recommendation?.urgencyLevel === 'EMERGENCY' ? 'Urgent' : recommendation?.urgencyLevel === 'URGENT' ? 'Urgent' : 'Stable',
      chwId: user.uid,
      updatedAt: serverTimestamp(),
      createdAt: existingPatient ? existingPatient.createdAt : serverTimestamp(),
    };

    setDoc(patientRef, patientUpdate, { merge: true })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: patientRef.path,
          operation: 'write',
          requestResourceData: patientUpdate
        }));
      });

    const encounterId = doc(collection(db, 'encounters')).id;
    const encounterRef = doc(db, 'patients', targetPatientId, 'encounters', encounterId);
    const encounterData = {
      id: encounterId,
      patientId: targetPatientId,
      chwId: user.uid,
      date: new Date().toISOString(),
      summary: `Assessment for ${patientData.name}. Seizure type: ${historyData.type}. Notes: ${redFlags.additionalNotes}`,
      redFlags: Object.keys(redFlags).filter(k => redFlags[k as keyof typeof redFlags] === true),
      recommendation: recommendation,
      status: 'approved',
      createdAt: serverTimestamp(),
    };

    setDoc(encounterRef, encounterData)
      .then(() => {
        toast({ title: "Clinical Record Synced", description: "Offline-first data saved locally." });
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

  const progressValue = 
    step === 'patient' ? 25 : 
    step === 'history' ? 50 : 
    step === 'redflags' ? 75 : 100;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-headline font-bold text-primary">New Encounter</h1>
        <Progress value={progressValue} className="h-2" />
      </div>

      {step === 'patient' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" /> Patient Profile
            </CardTitle>
            <CardDescription>Enter demographic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={patientData.name} 
                onChange={e => setPatientData({...patientData, name: e.target.value})} 
                placeholder="Patient's name" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input 
                  type="number" 
                  value={patientData.age} 
                  onChange={e => setPatientData({...patientData, age: e.target.value})} 
                  placeholder="Yrs" 
                />
              </div>
              <div className="space-y-2">
                <Label>Sex</Label>
                <Select value={patientData.sex} onValueChange={v => setPatientData({...patientData, sex: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location / Village</Label>
              <Input 
                value={patientData.location} 
                onChange={e => setPatientData({...patientData, location: e.target.value})} 
                placeholder="Village name" 
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input 
                value={patientData.contact} 
                onChange={e => setPatientData({...patientData, contact: e.target.value})} 
                placeholder="+254..." 
              />
            </div>
            <Button className="w-full mt-4 h-12 gap-2" onClick={handleNext}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'history' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Seizure History
            </CardTitle>
            <CardDescription>Clinical characteristics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Seizure Type</Label>
              <Select value={historyData.type} onValueChange={v => setHistoryData({...historyData, type: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="generalized">Generalized (Grand Mal)</SelectItem>
                  <SelectItem value="focal">Focal (Partial)</SelectItem>
                  <SelectItem value="absence">Absence (Petit Mal)</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (Min)</Label>
                <Input value={historyData.duration} onChange={e => setHistoryData({...historyData, duration: e.target.value})} placeholder="Approx mins" />
              </div>
              <div className="space-y-2">
                <Label>Frequency / Mo</Label>
                <Input value={historyData.frequency} onChange={e => setHistoryData({...historyData, frequency: e.target.value})} placeholder="Per month" />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <Label className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Known Triggers</Label>
              <div className="grid grid-cols-1 gap-2">
                {triggers.map(trigger => (
                  <div key={trigger} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/30">
                    <Checkbox 
                      id={trigger} 
                      checked={historyData.triggers.includes(trigger)}
                      onCheckedChange={(checked) => {
                        const newTriggers = checked 
                          ? [...historyData.triggers, trigger]
                          : historyData.triggers.filter(t => t !== trigger);
                        setHistoryData({...historyData, triggers: newTriggers});
                      }}
                    />
                    <label htmlFor={trigger} className="text-sm font-medium leading-none">{trigger}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBack}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-[2] h-12" onClick={handleNext}>Next <ChevronRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'redflags' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" /> Red Flags
            </CardTitle>
            <CardDescription>Select all that apply</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {redFlagItems.map(item => (
                <div key={item.id} className="flex items-start space-x-3 p-3 rounded-xl border border-red-100 bg-red-50/30">
                  <Checkbox 
                    id={item.id} 
                    className="mt-1"
                    checked={redFlags[item.id as keyof typeof redFlags] === true}
                    onCheckedChange={(c) => setRedFlags({...redFlags, [item.id]: !!c})}
                  />
                  <label htmlFor={item.id} className="text-xs font-semibold text-red-950 leading-relaxed">{item.label}</label>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Additional Notes</Label>
              <Textarea 
                value={redFlags.additionalNotes} 
                onChange={e => setRedFlags({...redFlags, additionalNotes: e.target.value})} 
                placeholder="Clinical observations..."
                className="bg-muted/20"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBack}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-[2] h-12 bg-primary font-bold shadow-lg shadow-primary/20" onClick={handleNext}>
                Assess Patient
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'assessment' && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-headline text-primary">Analyzing Clinical Data</h3>
            <p className="text-sm text-muted-foreground mt-1">Applying WHO Clinical Rules...</p>
          </div>
        </div>
      )}

      {step === 'report' && recommendation && (
        <div className="space-y-4">
          <Card className={recommendation.urgencyLevel === 'EMERGENCY' ? "bg-red-50 border-none shadow-xl" : "bg-green-50 border-none shadow-xl"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={recommendation.urgencyLevel === 'EMERGENCY' ? 'destructive' : 'secondary'} 
                  className="px-3 py-1 uppercase tracking-widest"
                >
                  {recommendation.urgencyLevel}
                </Badge>
                <ShieldAlert className={recommendation.urgencyLevel === 'EMERGENCY' ? "h-5 w-5 text-red-600" : "h-5 w-5 text-green-600"} />
              </div>
              <CardTitle className="text-2xl font-headline font-bold mt-4">Triage Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Action</h4>
                <p className="text-sm font-bold text-slate-900">{recommendation.action}</p>
                <div className="flex items-center gap-2 mt-1 text-primary">
                  <UserCircle className="h-4 w-4" />
                  <span className="text-xs font-semibold">{recommendation.referralDestination}</span>
                </div>
              </section>

              <section className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Clinical Reasoning</h4>
                <p className="text-sm leading-relaxed">{recommendation.clinicalReasoning}</p>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Counseling Messages</h4>
                <ul className="space-y-2">
                  {recommendation.counselingPoints.map((point, i) => (
                    <li key={i} className="text-xs flex items-start gap-2 leading-relaxed">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Risk Level</p>
                  <p className="text-lg font-bold text-primary">{recommendation.riskScore}/10</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Next Review</p>
                  <p className="text-xs font-bold">{recommendation.followUpInterval}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button className="w-full h-14 text-lg font-bold gap-2" onClick={handleAccept} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              {isSaving ? 'Syncing...' : 'Approve & Sync Record'}
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={() => setStep('redflags')}>
              Modify Clinical Input
            </Button>
          </div>
        </div>
      )}

      {/* Safety Warning Dialog */}
      <Dialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <DialogContent className="bg-red-600 text-white border-none shadow-2xl">
          <DialogHeader>
            <div className="mx-auto bg-white/20 p-3 rounded-full mb-2">
              <TriangleAlert className="h-10 w-10 text-white animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">SAFETY ALERT</DialogTitle>
            <DialogDescription className="text-white/90 text-center text-lg leading-relaxed">
              Patient exhibits <strong>EMERGENCY RED FLAGS</strong>. 
              Immediate specialist intervention required.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={() => setShowSafetyDialog(false)} 
              className="w-full h-14 bg-white text-red-600 hover:bg-white/90 text-lg font-bold"
            >
              I ACKNOWLEDGE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewEncounterPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <NewEncounterContent />
    </Suspense>
  );
}
