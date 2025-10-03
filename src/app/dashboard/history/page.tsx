

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
import { Star, FileText, Download, MessageSquareWarning, Bot, Printer, MessageSquare, User } from "lucide-react";
import { mockTestResults } from "@/lib/mock-data";
import { AiInsightDialog } from "@/components/dashboard/ai-insight-dialog";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { usePrint } from "@/hooks/usePrint";
import { TestResultPrintView } from "@/components/dashboard/TestResultPrintView";
import type { TestResult } from "@/lib/types";
import { format } from "date-fns";


function ResultBadge({ flag }: { flag: "Normal" | "High" | "Low" }) {
  const baseClasses = "text-xs font-semibold";
  const variants = {
    Normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };
  return <Badge className={cn(baseClasses, variants[flag])}>{flag}</Badge>;
}

const RatePersonnelDialog = ({ open, onOpenChange, personnelName }: { open: boolean, onOpenChange: (open: boolean) => void, personnelName: string }) => {
    const { toast } = useToast();
    const [rating, setRating] = useState(0);

    const handleSubmit = () => {
        onOpenChange(false);
        toast({
            title: "Thank you for your feedback!",
            description: `You rated ${personnelName} ${rating} out of 5 stars.`,
        });
        setRating(0);
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { onOpenChange(isOpen); if (!isOpen) setRating(0); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rate {personnelName}</DialogTitle>
                    <DialogDescription>Your feedback helps us maintain quality service.</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center gap-2 py-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                         <Star
                            key={star}
                            className={cn("w-8 h-8 cursor-pointer", rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-300")}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={rating === 0}>Submit Rating</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};


const ReportAbuseDialog = ({ open, onOpenChange, personnelName }: { open: boolean, onOpenChange: (open: boolean) => void, personnelName: string }) => {
    const { toast } = useToast();
    const handleSubmit = () => {
        onOpenChange(false);
        toast({
            title: "Report Submitted",
            description: `Your report concerning ${personnelName} has been received. Our team will investigate and take appropriate action.`,
            variant: "destructive"
        });
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report Misconduct</DialogTitle>
                    <DialogDescription>Please provide details about the issue with {personnelName}. Our team will review this immediately.</DialogDescription>
                </DialogHeader>
                <Textarea placeholder="Describe the incident..." className="my-4" rows={5} />
                <DialogFooter>
                    <Button variant="destructive" onClick={handleSubmit}>Submit Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

const PersonnelProfileDialog = ({ open, onOpenChange, personnelName }: { open: boolean, onOpenChange: (open: boolean) => void, personnelName: string }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Personnel Profile</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
                <Image src="https://picsum.photos/seed/personnel/100/100" alt={personnelName} width={100} height={100} className="rounded-full mx-auto mb-4" data-ai-hint="profile person" />
                <h3 className="text-lg font-semibold">{personnelName}</h3>
                <p className="text-sm text-muted-foreground">Certified Phlebotomist</p>
                <p className="text-sm mt-2">5 years of experience in sample collection and patient care. Member of the National Phlebotomy Association.</p>
            </div>
        </DialogContent>
    </Dialog>
)

const PersonnelActions = ({ personnelName, onOpenDialog, hasRating }: { personnelName: string; onOpenDialog: (type: 'rate' | 'report' | 'profile', name: string) => void; hasRating?: boolean }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 h-auto font-medium text-foreground">
                    {personnelName}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/chat">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onOpenDialog('profile', personnelName)}>
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!hasRating && (
                    <DropdownMenuItem onSelect={() => onOpenDialog('rate', personnelName)}>
                        <Star className="mr-2 h-4 w-4" />
                        Rate Personnel
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => onOpenDialog('report', personnelName)} className="text-destructive focus:text-destructive">
                    <MessageSquareWarning className="mr-2 h-4 w-4" />
                    Report Abuse
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export default function HistoryPage() {
    const [dialogs, setDialogs] = useState<{ rate: boolean, report: boolean, profile: boolean }>({ rate: false, report: false, profile: false });
    const [activePersonnel, setActivePersonnel] = useState("");
    const { print } = usePrint();
    const [promptedForRating, setPromptedForRating] = useState<string[]>([]);


    const handleAccordionChange = (value: string) => {
        const result = mockTestResults.find(r => r.id === value);
        if (result && !result.rating && !promptedForRating.includes(result.id)) {
            setTimeout(() => {
                openDialog('rate', result.personnelName);
                setPromptedForRating(prev => [...prev, result.id]);
            }, 1000); // 1 second delay
        }
    }

    const handlePrint = (result: TestResult) => {
        print(<TestResultPrintView result={result} />);
    }

    const openDialog = (type: 'rate' | 'report' | 'profile', personnelName: string) => {
        setActivePersonnel(personnelName);
        setDialogs(prev => ({ ...prev, [type]: true }));
    }

    const closeDialog = (type: 'rate' | 'report' | 'profile') => {
        setDialogs(prev => ({ ...prev, [type]: false }));
    }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Test History</CardTitle>
        <CardDescription>
          Access your past test results, print reports, and get AI insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
          {mockTestResults.map((result) => (
            <AccordionItem key={result.id} value={result.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="text-left">
                    <p className="font-semibold">{result.testName}</p>
                    <p className="text-sm text-muted-foreground">
                      Date: {format(new Date(result.date), "PPP p")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.rating && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{result.rating}/5</span>
                        </div>
                    )}
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-muted/50 rounded-md">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-semibold mb-2">Results</h4>
                        <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-sm">
                            <div className="font-medium text-muted-foreground col-span-2">Analyte</div>
                            <div className="font-medium text-muted-foreground text-right">Value</div>
                            <div className="font-medium text-muted-foreground text-right">Range</div>
                            
                            {Object.entries(result.results).map(([key, res]) => (
                                <React.Fragment key={key}>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <span>{key}</span>
                                        <ResultBadge flag={res.flag} />
                                    </div>
                                    <div className="text-right font-mono">{res.value}</div>
                                    <div className="text-right font-mono text-muted-foreground">{res.range}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handlePrint(result)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                         <AiInsightDialog historyData={[result]} />
                    </div>
                </div>
                <CardFooter className="px-0 pt-4 mt-4 border-t justify-between items-center">
                   <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Personnel: 
                        <PersonnelActions 
                            personnelName={result.personnelName}
                            onOpenDialog={openDialog}
                            hasRating={!!result.rating}
                        />
                    </p>
                  <div className="flex gap-2">
                    {!result.rating && (
                         <Button size="sm" variant="outline" onClick={() => openDialog('rate', result.personnelName)}>Rate</Button>
                    )}
                    <Button size="sm" variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20" onClick={() => openDialog('report', result.personnelName)}>
                        Report
                    </Button>
                  </div>
                </CardFooter>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {mockTestResults.length > 1 && (
            <div className="mt-6 flex justify-center">
                 <AiInsightDialog historyData={mockTestResults}>
                    <Button>
                        <Bot className="mr-2 h-4 w-4" />
                        Analyze Full Test History
                    </Button>
                </AiInsightDialog>
            </div>
        )}
      </CardContent>
    </Card>
    
    <RatePersonnelDialog open={dialogs.rate} onOpenChange={(isOpen) => closeDialog(isOpen ? 'rate' : 'rate')} personnelName={activePersonnel} />
    <ReportAbuseDialog open={dialogs.report} onOpenChange={(isOpen) => closeDialog(isOpen ? 'report' : 'report')} personnelName={activePersonnel} />
    <PersonnelProfileDialog open={dialogs.profile} onOpenChange={(isOpen) => closeDialog(isOpen ? 'profile' : 'profile')} personnelName={activePersonnel} />
    </>
  );
}
