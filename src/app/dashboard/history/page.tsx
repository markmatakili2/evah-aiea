'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, ClipboardList, ExternalLink } from "lucide-react";
import { mockEncounters, mockPatients } from "@/lib/mock-data";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";

export default function HistoryPage() {
  const [encounters, setEncounters] = useState<any[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const demoFlag = localStorage.getItem('is_demo') === 'true';
    setIsDemo(demoFlag);
    if (demoFlag) {
      setEncounters(mockEncounters);
    } else {
      setEncounters([]);
    }
  }, []);

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="font-headline text-2xl font-bold text-primary italic">Regional Clinical History</CardTitle>
        <CardDescription>
          Unified view of all patient encounters and triage results in your circle.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {encounters.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {encounters.map((encounter) => {
              const patient = mockPatients.find(p => p.id === encounter.patientId);
              return (
                <AccordionItem key={encounter.id} value={encounter.id} className="border rounded-xl bg-card px-4 shadow-sm">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex justify-between items-center w-full pr-4">
                      <div className="text-left">
                        <div className="font-bold text-primary flex items-center gap-1">
                          {patient?.name || `Case #${encounter.id.toUpperCase()}`}
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
                          {format(new Date(encounter.date), "PPP")}
                        </p>
                      </div>
                      <Badge variant={encounter.recommendation.urgencyLevel === 'EMERGENCY' ? 'destructive' : 'secondary'} className="text-[8px] h-5 px-2 uppercase">
                        {encounter.recommendation.urgencyLevel}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-0">
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">Clinical Summary</h4>
                          <p className="text-sm leading-relaxed text-slate-700">{encounter.summary}</p>
                        </div>
                        <Button asChild variant="outline" size="sm" className="shrink-0 h-8 text-[10px] font-bold uppercase text-primary gap-1 border-primary/20">
                          <Link href={`/dashboard/records/${encounter.patientId}/history`}>
                            Full History <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <User className="h-3 w-3 text-primary/60" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Author: {encounter.authorName} ({encounter.authorRole})</span>
                      </div>

                      {encounter.redFlags.length > 0 && (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                          <h4 className="text-[10px] font-bold uppercase text-red-600 mb-1">Red Flags Detected</h4>
                          <ul className="text-xs list-disc pl-4 text-red-900 space-y-0.5">
                            {encounter.redFlags.map((f: string, i: number) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <h4 className="text-[10px] font-bold uppercase text-primary mb-1">Proposed Management</h4>
                        <p className="text-sm font-bold text-slate-800">{encounter.recommendation.action}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-muted/10">
            <ClipboardList className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">No encounter history found.</p>
            <p className="text-xs text-muted-foreground mt-1">Start a new encounter to build the clinical registry.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
