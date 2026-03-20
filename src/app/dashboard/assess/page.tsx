'use client';

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mic, 
  MessageSquare, 
  Plus, 
  Send, 
  Paperclip, 
  X, 
  History, 
  ChevronLeft, 
  Sparkles,
  CheckCircle2,
  Edit3,
  Loader2,
  MoreVertical,
  TriangleAlert,
  MapPin
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { runClinicalLogic } from "@/lib/clinical-engine/engine";
import { Recommendation, ClinicalInput } from "@/lib/clinical-engine/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { FacilityMap } from "@/components/dashboard/facility-map";

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type?: 'text' | 'audio' | 'analysis';
  recommendation?: Recommendation;
};

export default function AssessPage() {
  const { user } = useUser();
  const db = useFirestore();

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionDraft, setTranscriptionDraft] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);

  // Fetch real patients from DB
  const patientsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'patients'),
      where('chwId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );
  }, [db, user]);

  const { data: patients } = useCollection(patientsQuery);
  const selectedPatient = patients?.find(p => p.id === selectedPatientId);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcriptionDraft]);

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setShowHistory(false);
    setMessages([
      {
        id: '1',
        role: 'ai',
        content: `I'm ready to assist with ${patients?.find(p => p.id === id)?.name}. Describe symptoms via voice or text for real-time WHO protocol analysis.`,
        type: 'text'
      }
    ]);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    runOnDeviceAnalysis(inputText);
  };

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setTranscriptionDraft("Mgonjwa amepata kifafa mara tatu leo asubuhi. Kila mara kilidumu kwa dakika mbili. Hana homa lakini amekosa dawa kwa siku tatu.");
    }, 3000);
  };

  const handleFinalizeTranscription = () => {
    if (!transcriptionDraft) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: transcriptionDraft, type: 'audio' };
    setMessages(prev => [...prev, userMsg]);
    const textToAnalyze = transcriptionDraft;
    setTranscriptionDraft(null);
    runOnDeviceAnalysis(textToAnalyze);
  };

  const runOnDeviceAnalysis = (input: string) => {
    setIsProcessing(true);
    
    const isEmergency = input.toLowerCase().includes("mara tatu") || input.toLowerCase().includes("repeated");
    const isMedFail = input.toLowerCase().includes("amekosa dawa") || input.toLowerCase().includes("missed");

    const clinicalInput: ClinicalInput = {
      patientProfile: {
        age: selectedPatient?.age || 30,
        sex: selectedPatient?.gender || 'other',
      },
      seizureHistory: {
        type: 'generalized',
        duration: '2 min',
        frequency: '3/day',
        triggers: ['missed medication'],
      },
      redFlags: {
        repeated: isEmergency,
        feverNeck: false,
        injury: false,
        newOnsetUnder5: false,
        medicationFail: isMedFail,
      }
    };

    setTimeout(() => {
      const result = runClinicalLogic(clinicalInput);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `Clinical analysis complete using WHO on-device engine. Urgency: ${result.urgencyLevel}.`,
        type: 'analysis',
        recommendation: result
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);

      if (result.urgencyLevel === 'EMERGENCY') {
        setShowSafetyDialog(true);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] bg-background relative overflow-hidden">
      {/* Sidebar Overlay for History */}
      <div className={cn(
        "absolute inset-0 z-50 bg-background transition-transform duration-300 ease-in-out",
        showHistory ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between bg-primary text-primary-foreground">
            <h2 className="font-headline font-bold flex items-center gap-2">
              <History className="h-5 w-5" /> Encounter History
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4">
            <Button asChild className="w-full justify-start gap-2 h-12" variant="outline">
              <Link href="/dashboard/new-encounter">
                <Plus className="h-5 w-5 text-primary" /> New Patient Record
              </Link>
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 pb-4">
              {patients && patients.length > 0 ? (
                patients.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient.id)}
                    className="w-full text-left p-4 rounded-xl border hover:bg-muted transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-primary group-hover:text-primary/80">{patient.name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase">{patient.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Village: {patient.location}</p>
                  </button>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  No registered patients found.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {!selectedPatientId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
          <div className="bg-primary/5 p-6 rounded-full">
            <MessageSquare className="h-12 w-12 text-primary/40" />
          </div>
          <h2 className="text-xl font-headline font-bold text-primary">Clinical AI Chat</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Select a patient to begin WHO-guided diagnosis and triage.
          </p>
          <Button onClick={() => setShowHistory(true)} variant="outline" className="gap-2">
            <History className="h-4 w-4" /> View History
          </Button>
        </div>
      ) : (
        <>
          <header className="p-3 border-b bg-card flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowHistory(true)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold truncate">{selectedPatient?.name}</span>
                <Badge variant="secondary" className="h-4 text-[9px]">{selectedPatient?.status}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">
                {selectedPatient?.age}Y • {selectedPatient?.location} • AI Assisted
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </header>

          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-6 pb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                )}>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-white border rounded-tl-none"
                  )}>
                    {msg.type === 'audio' && <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] font-bold uppercase"><Mic className="h-3 w-3" /> Voice Input</div>}
                    {msg.content}
                  </div>

                  {msg.type === 'analysis' && msg.recommendation && (
                    <div className="w-full mt-2 space-y-3">
                      <Card className={cn(
                        "w-full shadow-md border-l-4",
                        msg.recommendation.urgencyLevel === 'EMERGENCY' ? "border-red-600 bg-red-50" : "border-primary bg-primary/5"
                      )}>
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge className={msg.recommendation.urgencyLevel === 'EMERGENCY' ? "bg-red-600 text-white" : "bg-primary text-white"}>
                              {msg.recommendation.urgencyLevel}
                            </Badge>
                            <Sparkles className="h-4 w-4 text-primary opacity-50" />
                          </div>
                          
                          <section>
                            <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest mb-1">Recommended Action</h4>
                            <p className="text-xs font-bold text-slate-800">{msg.recommendation.action}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">To: {msg.recommendation.referralDestination}</p>
                          </section>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10">
                            <Button size="sm" className="h-8 text-[10px] font-bold gap-1 bg-green-600 hover:bg-green-700">
                              <CheckCircle2 className="h-3 w-3" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold gap-1">
                              <Edit3 className="h-3 w-3" /> Override
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {msg.recommendation.urgencyLevel !== 'STABLE' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                          <div className="flex items-center gap-2 text-primary px-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">GIS Facility Referral</span>
                          </div>
                          <FacilityMap urgency={msg.recommendation.urgencyLevel} patientLocation={selectedPatient?.location} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-medium">On-device Clinical Logic Active...</span>
                </div>
              )}

              {transcriptionDraft && (
                <div className="ml-auto w-[85%] space-y-2 animate-in slide-in-from-right-4">
                  <div className="bg-accent/10 border border-accent/30 p-4 rounded-2xl rounded-tr-none space-y-3">
                    <div className="flex items-center justify-between border-b border-accent/20 pb-2 mb-2">
                      <span className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                        <Mic className="h-3 w-3" /> Verify Transcription
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setTranscriptionDraft(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea 
                      value={transcriptionDraft}
                      onChange={(e) => setTranscriptionDraft(e.target.value)}
                      className="text-sm bg-white border-none shadow-none focus-visible:ring-0 min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleFinalizeTranscription} className="flex-1 h-9 text-xs font-bold bg-primary">
                        Confirm & Analyze
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-card border-t border-muted pb-6">
            <div className="flex items-end gap-2 max-w-md mx-auto">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Type symptoms or notes..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[40px] max-h-[120px] pr-10 resize-none py-2 rounded-2xl bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendText();
                    }
                  }}
                />
                {inputText.trim() && (
                  <Button 
                    onClick={handleSendText}
                    size="icon" 
                    className="absolute right-1 bottom-1 h-8 w-8 rounded-xl bg-primary shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {!inputText.trim() && (
                <Button 
                  onClick={isRecording ? () => setIsRecording(false) : startRecording}
                  size="icon" 
                  className={cn(
                    "h-10 w-10 rounded-full transition-all duration-300 shrink-0",
                    isRecording ? "bg-red-500 scale-110 shadow-lg" : "bg-accent text-accent-foreground"
                  )}
                >
                  <Mic className={cn("h-5 w-5", isRecording && "animate-pulse")} />
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Safety Alert Modal */}
      <Dialog open={showSafetyDialog} onOpenChange={setShowSafetyDialog}>
        <DialogContent className="bg-red-600 text-white border-none shadow-2xl">
          <DialogHeader>
            <div className="mx-auto bg-white/20 p-3 rounded-full mb-2">
              <TriangleAlert className="h-10 w-10 text-white animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">SAFETY ALERT</DialogTitle>
            <DialogDescription className="text-white/90 text-center text-lg leading-relaxed">
              Analysis detected <strong>EMERGENCY RED FLAGS</strong>. 
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
