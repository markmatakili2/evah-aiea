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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, FileText, MessageSquareWarning, Bot, Printer, MessageSquare, User, ClipboardList } from "lucide-react";
import { mockEncounters } from "@/lib/mock-data";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Regional Clinical History</CardTitle>
        <CardDescription>
          Unified view of all patient encounters and triage results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {encounters.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {encounters.map((encounter) => (
              <AccordionItem key={encounter.id} value={encounter.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="text-left">
                      <p className="font-semibold">Case #{encounter.id.toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        Date: {format(new Date(encounter.date), "PPP")}
                      </p>
                    </div>
                    <Badge variant={encounter.type === 'Emergency' ? 'destructive' : 'secondary'}>
                      {encounter.type}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/50 rounded-md">
                  <div className="space-y-4">
                    <div>
                        <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">Summary</h4>
                        <p className="text-sm leading-relaxed">{encounter.summary}</p>
                    </div>
                    {encounter.redFlags.length > 0 && (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                            <h4 className="text-[10px] font-bold uppercase text-red-600 mb-1">Red Flags Reported</h4>
                            <ul className="text-xs list-disc pl-4 text-red-900">
                                {encounter.redFlags.map((f: string, i: number) => <li key={i}>{f}</li>)}
                            </ul>
                        </div>
                    )}
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <h4 className="text-[10px] font-bold uppercase text-primary mb-1">Final Action Taken</h4>
                        <p className="text-sm font-bold text-slate-800">{encounter.recommendation.action}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
            <ClipboardList className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">No encounter history found.</p>
            <p className="text-xs text-muted-foreground mt-1">New accounts start with a clean registry.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
