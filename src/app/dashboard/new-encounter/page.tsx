'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronRight, 
  ChevronLeft, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  FileText,
  UserCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

type Step = 'patient' | 'history' | 'redflags' | 'assessment' | 'report';

export default function NewEncounterPage() {
  const [step, setStep] = useState<Step>('patient');
  const { toast } = useToast();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    sex: '',
    location: '',
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
  });

  const [aiReport, setAiReport] = useState({
    flagsDetected: [] as string[],
    referral: '',
    reasoning: '',
    counseling: '',
    decision: '',
  });

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
    else if (step === 'redflags') setStep('assessment');
  };

  const handleBack = () => {
    if (step === 'history') setStep('patient');
    else if (step === 'redflags') setStep('history');
    else if (step === 'assessment') setStep('redflags');
  };

  const runAssessment = () => {
    setStep('assessment');
    // Simulated AI Logic
    setTimeout(() => {
      const detected = Object.entries(redFlags)
        .filter(([_, value]) => value === true)
        .map(([key]) => redFlagItems.find(i => i.id === key)?.label || '');

      const isUrgent = detected.length > 0;

      setAiReport({
        flagsDetected: detected,
        referral: isUrgent ? 'URGENT REFERRAL' : 'STABLE - LOCAL FOLLOW-UP',
        reasoning: isUrgent 
          ? 'Patient exhibits one or more clinical red flags associated with high-risk neurological complications or status epilepticus risk.'
          : 'Clinical signs suggest controlled seizure activity. No immediate life-threatening markers detected during this assessment.',
        counseling: 'Advise family on safety (avoiding heights/fire), medication adherence, and recognizing early warning signs of recurrence.',
        decision: isUrgent 
          ? 'Refer to nearest tertiary hospital immediately for specialist review and possible EEG/Imaging.'
          : 'Schedule routine follow-up in 2 weeks at community clinic. Monitor medication log.',
      });
      setStep('report');
    }, 2000);
  };

  const handleAccept = () => {
    toast({ title: "Assessment Saved", description: "The encounter record has been synced." });
    router.push('/dashboard');
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
                    checked={redFlags[item.id as keyof typeof redFlags]}
                    onCheckedChange={(c) => setRedFlags({...redFlags, [item.id]: !!c})}
                  />
                  <label htmlFor={item.id} className="text-xs font-semibold text-red-950 leading-relaxed">{item.label}</label>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={handleBack}><ChevronLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-[2] h-12 bg-primary font-bold shadow-lg shadow-primary/20" onClick={runAssessment}>
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
            <h3 className="text-xl font-bold font-headline text-primary">Analyzing Case Data</h3>
            <p className="text-sm text-muted-foreground mt-1">Cross-referencing WHO Epilepsy Guidelines...</p>
          </div>
        </div>
      )}

      {step === 'report' && (
        <div className="space-y-4">
          <Card className={cn(
            "border-none shadow-xl",
            aiReport.referral.includes('URGENT') ? "bg-red-50" : "bg-green-50"
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={aiReport.referral.includes('URGENT') ? 'destructive' : 'secondary'} className="px-3 py-1">
                  {aiReport.referral}
                </Badge>
                <Sparkles className="h-5 w-5 text-primary opacity-50" />
              </div>
              <CardTitle className="text-2xl font-headline font-bold mt-4">Clinical Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiReport.flagsDetected.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-red-600">Red Flags Detected</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {aiReport.flagsDetected.map((f, i) => (
                      <li key={i} className="text-sm font-medium text-red-900">{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <section className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Clinical Reasoning</h4>
                  {isEditing ? (
                    <Textarea 
                      value={aiReport.reasoning} 
                      onChange={e => setAiReport({...aiReport, reasoning: e.target.value})} 
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{aiReport.reasoning}</p>
                  )}
                </section>

                <section className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Counseling Points</h4>
                  {isEditing ? (
                    <Textarea 
                      value={aiReport.counseling} 
                      onChange={e => setAiReport({...aiReport, counseling: e.target.value})} 
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{aiReport.counseling}</p>
                  )}
                </section>

                <section className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Clinical Decision</h4>
                  {isEditing ? (
                    <Textarea 
                      value={aiReport.decision} 
                      onChange={e => setAiReport({...aiReport, decision: e.target.value})} 
                      className="bg-white"
                    />
                  ) : (
                    <p className="text-sm font-bold leading-relaxed text-primary">{aiReport.decision}</p>
                  )}
                </section>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button className="w-full h-14 text-lg font-bold gap-2" onClick={handleAccept}>
              <CheckCircle2 className="h-5 w-5" /> Accept Recommendation
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Finish Editing' : 'Override / Modify Report'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
