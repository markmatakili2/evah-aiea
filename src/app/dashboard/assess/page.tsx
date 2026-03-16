'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, MessageSquare, Sparkles, UserCircle, Phone, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type VoiceStep = 'metadata' | 'recording' | 'processing' | 'result';

export default function AssessPage() {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceStep, setVoiceStep] = useState<VoiceStep>('metadata');
  
  // Voice Metadata Form
  const [metadata, setMetadata] = useState({
    name: '',
    age: '',
    sex: '',
    location: '',
    contact: ''
  });

  const handleStartVoice = () => {
    setIsVoiceOpen(true);
    setVoiceStep('metadata');
  };

  const startRecording = () => {
    setVoiceStep('recording');
    // Simulated auto-stop after 3 seconds
    setTimeout(() => {
      setVoiceStep('processing');
      setTimeout(() => setVoiceStep('result'), 2500);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-headline font-bold text-primary">Assessment Tools</h1>
        <p className="text-sm text-muted-foreground">Select a diagnostic mode to begin.</p>
      </div>

      <div className="grid gap-4">
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Mic className="h-24 w-24" />
          </div>
          <CardHeader>
            <div className="bg-accent/20 w-fit p-2 rounded-lg mb-2">
              <Mic className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">Voice Input</CardTitle>
            <CardDescription className="text-primary-foreground/70">
              Record seizure descriptions in Swahili or local dialects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full font-bold" onClick={handleStartVoice}>
              Start Recording
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader>
            <div className="bg-primary/10 w-fit p-2 rounded-lg mb-2">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">New Encounter</CardTitle>
            <CardDescription>
              Step-by-step questionnaire following WHO guidelines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full font-bold">
              <Link href="/dashboard/new-encounter">
                Start Questionnaire
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-dashed border-accent/30">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="bg-accent/20 p-3 rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-headline font-bold text-primary">AI Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Results are cross-referenced with WHO mhGAP Epilepsy protocols for triage accuracy.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Voice Assessment Dialog */}
      <Dialog open={isVoiceOpen} onOpenChange={setIsVoiceOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-headline">Voice Assessment</DialogTitle>
            <DialogDescription>Capture details and record description.</DialogDescription>
          </DialogHeader>

          {voiceStep === 'metadata' && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input value={metadata.name} onChange={e => setMetadata({...metadata, name: e.target.value})} placeholder="Full name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" value={metadata.age} onChange={e => setMetadata({...metadata, age: e.target.value})} placeholder="Yrs" />
                </div>
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <Select value={metadata.sex} onValueChange={v => setMetadata({...metadata, sex: v})}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={metadata.location} onChange={e => setMetadata({...metadata, location: e.target.value})} placeholder="Village / Sector" />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input value={metadata.contact} onChange={e => setMetadata({...metadata, contact: e.target.value})} placeholder="+254..." />
              </div>
              <Button className="w-full mt-4 h-12" onClick={startRecording} disabled={!metadata.name || !metadata.contact}>
                Next: Start Recording
              </Button>
            </div>
          )}

          {voiceStep === 'recording' && (
            <div className="flex flex-col items-center justify-center py-10 gap-6 text-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-red-100 animate-ping absolute inset-0 opacity-50" />
                <div className="h-24 w-24 rounded-full bg-red-500 flex items-center justify-center relative z-10">
                  <Mic className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-red-600">Recording Info...</h3>
                <p className="text-sm text-muted-foreground">Describe the seizure onset and duration in any language.</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setVoiceStep('processing')}>Stop & Analyze</Button>
            </div>
          )}

          {voiceStep === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div className="space-y-1">
                <h3 className="font-bold">Clinical Engine Processing</h3>
                <p className="text-xs text-muted-foreground px-10">Transcribing Swahili/Local dialects and extracting clinical markers...</p>
              </div>
            </div>
          )}

          {voiceStep === 'result' && (
            <div className="space-y-4">
              <Card className="bg-green-50 border-none shadow-none">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">STABLE - LOCAL FOLLOW-UP</Badge>
                    <Sparkles className="h-4 w-4 text-primary opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <section>
                      <h4 className="text-[10px] font-bold uppercase text-muted-foreground">Extracted Notes</h4>
                      <p className="text-xs italic text-slate-600 leading-relaxed">"Patient reported 3 seizures this month, each lasting approx 2 minutes. No fever reported. Seizure starts with blank stare..."</p>
                    </section>
                    <section>
                      <h4 className="text-[10px] font-bold uppercase text-muted-foreground">Reasoning</h4>
                      <p className="text-xs">Clinical markers suggest focal seizures. No urgent red flags detected from voice transcription.</p>
                    </section>
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={() => setIsVoiceOpen(false)}>Accept Recommendation</Button>
                <Button variant="outline" className="w-full">Modify Report</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
