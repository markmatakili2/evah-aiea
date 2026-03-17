'use client';

import { useState, useRef, useEffect } from "react";
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
  AlertCircle,
  CheckCircle2,
  Edit3,
  Loader2,
  MoreVertical,
  UserCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { mockPatients } from "@/lib/mock-data";
import Link from "next/link";

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type?: 'text' | 'audio' | 'analysis';
  data?: any;
  status?: 'draft' | 'pending' | 'final';
};

export default function AssessPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionDraft, setTranscriptionDraft] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcriptionDraft]);

  const selectedPatient = mockPatients.find(p => p.id === selectedPatientId);

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setShowHistory(false);
    // Add initial context message
    setMessages([
      {
        id: '1',
        role: 'ai',
        content: `I'm ready to assist with ${mockPatients.find(p => p.id === id)?.name}. You can describe new symptoms via voice or text, or upload clinical files.`,
        type: 'text'
      }
    ]);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    runAiAnalysis(inputText);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate auto-stop after 3 seconds for demo
    setTimeout(() => {
      setIsRecording(false);
      setTranscriptionDraft("Mgonjwa amepata kifafa mara tatu leo asubuhi. Kila mara kilidumu kwa dakika mbili. Hana homa.");
    }, 3000);
  };

  const handleFinalizeTranscription = () => {
    if (!transcriptionDraft) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: transcriptionDraft, type: 'audio' };
    setMessages(prev => [...prev, userMsg]);
    const textToAnalyze = transcriptionDraft;
    setTranscriptionDraft(null);
    runAiAnalysis(textToAnalyze);
  };

  const runAiAnalysis = (input: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Clinical analysis complete based on WHO protocols.",
        type: 'analysis',
        data: {
          flags: ["Frequent seizures (3/day)"],
          recommendation: "Stable - Adjust medication dose and monitor.",
          reasoning: "Seizure frequency has increased from baseline, but no emergency red flags (fever, status epilepticus) are present.",
          followUp: "Follow up in 48 hours. Ensure family has emergency midazolam if available.",
        }
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
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
              {mockPatients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient.id)}
                  className="w-full text-left p-4 rounded-xl border hover:bg-muted transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-primary group-hover:text-primary/80">{patient.name}</span>
                    <Badge variant="outline" className="text-[10px] uppercase">{patient.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Last encounter: 20 July</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Interface */}
      {!selectedPatientId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
          <div className="bg-primary/5 p-6 rounded-full">
            <MessageSquare className="h-12 w-12 text-primary/40" />
          </div>
          <h2 className="text-xl font-headline font-bold text-primary">Clinical AI Chat</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Select a patient from history or start a new encounter to begin AI-guided diagnosis.
          </p>
          <Button onClick={() => setShowHistory(true)} variant="outline" className="gap-2">
            <History className="h-4 w-4" /> View History
          </Button>
        </div>
      ) : (
        <>
          {/* Chat Header */}
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
                {selectedPatient?.age}Y • {selectedPatient?.village} • Follow-up required
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </header>

          {/* Messages Area */}
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

                  {msg.type === 'analysis' && msg.data && (
                    <Card className="mt-2 border-primary/20 bg-primary/5 w-full shadow-lg">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-primary text-accent text-[10px]">AI RECOMMENDATION</Badge>
                          <Sparkles className="h-4 w-4 text-primary opacity-50" />
                        </div>
                        
                        <section>
                          <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest mb-1">Detected Flags</h4>
                          <ul className="space-y-1">
                            {msg.data.flags.map((f: string, i: number) => (
                              <li key={i} className="text-xs flex items-center gap-2 text-red-700 font-medium">
                                <AlertCircle className="h-3 w-3" /> {f}
                              </li>
                            ))}
                          </ul>
                        </section>

                        <section>
                          <h4 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">Recommendation</h4>
                          <p className="text-xs font-bold text-slate-800">{msg.data.recommendation}</p>
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
                  )}
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-medium">Analyzing WHO protocols...</span>
                </div>
              )}

              {/* Recording / Draft State */}
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

          {/* Chat Input Bar */}
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
            {isRecording && (
              <div className="flex justify-center mt-2">
                <span className="text-[10px] font-bold text-red-500 animate-pulse uppercase tracking-widest">
                  Recording Audio...
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
