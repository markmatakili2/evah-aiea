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
  MapPin
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
      if (startAt === 'redflags') setStep('redflags');
      else setStep('history');
    }
  }, [existingPatient, startAt]);

  const runAssessment = () => {
    setStep('assessment');
    const input: ClinicalInput = {
      patientProfile: { age: parseInt(patientData.age) || 0, sex: patientData.sex },
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
    
    const patientUpdate = {
      id: targetPatientId,
      name: patientData.name,
      age: parseInt(patientData.age),
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
      summary: `Assessment. Seizure type: ${historyData.type}. Notes: ${redFlags.additionalNotes}`,
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

  return (
    <div className="max-w-md mx-auto space-y-6 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-headline font-bold text-primary">Clinical Assessment</h1>
        <Progress value={step === 'patient' ? 20 : step === 'history' ? 40 : step === 'redflags' ? 60 : 80} className="h-2" />
      </div>

      {step === 'patient' && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary" /> Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={patientData.name} onChange={e => setPatientData({...patientData, name: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Age</Label><Input type="number" value={patientData.age} onChange={e => setPatientData({...patientData, age: e.target.value})} /></div>
              <div className="space-y-2">
                <Label>Sex</Label>
                <Select value={patientData.sex} onValueChange={v => setPatientData({...patientData, sex: v})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Village</Label><Input value={patientData.location} onChange={e => setPatientData({...patientData, location: e.target.value})} /></div>
            <div className="space-y-2"><Label>Contact</Label><Input value={patientData.contact} onChange={e => setPatientData({...patientData, contact: e.target.value})} /></div>
            <Button className="w-full h-12" onClick={() => setStep('history')}>Next <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      )}

      {step === 'history' && (
        <Card className="border-none shadow-sm">
          <CardHeader><CardTitle className="text-lg">History</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Seizure Type</Label>
              <Select value={historyData.type} onValueChange={v => setHistoryData({...historyData, type: v})}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="generalized">Generalized</SelectItem><SelectItem value="focal">Focal</SelectItem></SelectContent>
              </Select>
            </div>
            <Button className="w-full h-12" onClick={() => setStep('redflags')}>Next <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      )}

      {step === 'redflags' && (
        <Card className="border-none shadow-sm">
          <CardHeader><CardTitle className="text-lg text-red-600 flex gap-2"><ShieldAlert /> Red Flags</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {['repeated', 'feverNeck', 'injury'].map(id => (
              <div key={id} className="flex items-center space-x-3 p-3 bg-red-50/20 rounded-lg">
                <Checkbox id={id} checked={redFlags[id as keyof typeof redFlags] === true} onCheckedChange={c => setRedFlags({...redFlags, [id]: !!c})} />
                <Label htmlFor={id} className="text-xs font-bold leading-relaxed">{id === 'repeated' ? 'Repeated seizures' : id === 'feverNeck' ? 'Fever & Neck Stiffness' : 'Injury'}</Label>
              </div>
            ))}
            <Textarea placeholder="Additional observations..." value={redFlags.additionalNotes} onChange={e => setRedFlags({...redFlags, additionalNotes: e.target.value})} />
            <Button className="w-full h-12 bg-primary font-bold" onClick={runAssessment}>Assess Patient</Button>
          </CardContent>
        </Card>
      )}

      {step === 'assessment' && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="text-xl font-bold font-headline text-primary">On-Device Clinical Logic Active</h3>
        </div>
      )}

      {step === 'report' && recommendation && (
        <div className="space-y-6">
          <Card className={recommendation.urgencyLevel === 'EMERGENCY' ? "bg-red-50 border-red-200" : recommendation.urgencyLevel === 'URGENT' ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"}>
            <CardHeader>
              <Badge variant={recommendation.urgencyLevel === 'EMERGENCY' ? 'destructive' : 'secondary'}>{recommendation.urgencyLevel}</Badge>
              <CardTitle className="text-xl mt-2">AI Triage Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section><h4 className="text-[10px] font-bold uppercase text-muted-foreground">Reasoning</h4><p className="text-sm">{recommendation.clinicalReasoning}</p></section>
              <section><h4 className="text-[10px] font-bold uppercase text-muted-foreground">Action</h4><p className="text-sm font-bold">{recommendation.action}</p></section>
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
            <Button className="w-full h-14 font-bold" onClick={() => saveRecord('approved')} disabled={isSaving}>Accept & Sync</Button>
            <Button variant="outline" className="w-full h-12" onClick={() => setShowOverrideDialog(true)}>
              <Edit3 className="h-4 w-4 mr-2" /> Safety Override
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Clinical Override Reason</DialogTitle><DialogDescription>All overrides are logged for safety audit.</DialogDescription></DialogHeader>
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
            <div className="space-y-2"><Label>Detailed Notes</Label><Textarea value={overrideData.notes} onChange={e => setOverrideData({...overrideData, notes: e.target.value})} placeholder="Why is this recommendation being overridden?" /></div>
          </div>
          <DialogFooter><Button variant="destructive" className="w-full" disabled={!overrideData.reason} onClick={() => saveRecord('overridden')}>Confirm Override</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <DialogContent className="bg-red-600 text-white">
          <DialogHeader><div className="mx-auto bg-white/20 p-3 rounded-full mb-2"><TriangleAlert className="h-10 w-10 text-white animate-pulse" /></div><DialogTitle className="text-2xl font-bold text-center">SAFETY ALERT</DialogTitle></DialogHeader>
          <p className="text-center text-lg">Patient exhibits <strong>EMERGENCY RED FLAGS</strong>. Immediate specialist intervention required.</p>
          <DialogFooter><Button onClick={() => setShowSafetyDialog(false)} className="w-full h-14 bg-white text-red-600 font-bold">I ACKNOWLEDGE</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewEncounterPage() { return <Suspense fallback={<div>Loading...</div>}><NewEncounterContent /></Suspense>; }
