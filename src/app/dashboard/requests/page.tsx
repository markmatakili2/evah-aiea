'use client';

import {
  MoreHorizontal,
  FilePenLine,
  XCircle,
  CreditCard,
  Truck,
  Loader,
  FileText,
  MessageSquare,
  User,
  Star,
  MessageSquareWarning,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { mockTestRequests, mockTestResults } from "@/lib/mock-data";
import type { TestRequestStatus, TestResult } from "@/lib/types";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const statusVariant: Record<
  TestRequestStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Pending: "outline",
  Allocated: "default",
  "Sample Collected": "default",
  "In Analysis": "default",
  Completed: "secondary",
  Cancelled: "destructive",
};

function ResultBadge({ flag }: { flag: "Normal" | "High" | "Low" }) {
  const baseClasses = "text-xs font-semibold";
  const variants = {
    Normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };
  return <Badge className={cn(baseClasses, variants[flag])}>{flag}</Badge>;
}

const progressSteps = [
  "Pending",
  "Allocated",
  "Sample Collected",
  "In Analysis",
  "Completed",
];

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

const PersonnelActions = ({ personnelName, onOpenDialog }: { personnelName: string, onOpenDialog: (type: 'profile' | 'rate' | 'report', name: string) => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto font-medium text-foreground"
        >
          {personnelName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Actions
        </DropdownMenuLabel>
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
        <DropdownMenuItem onSelect={() => onOpenDialog('rate', personnelName)}>
          <Star className="mr-2 h-4 w-4" />
          Rate Personnel
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onOpenDialog('report', personnelName)} className="text-destructive focus:text-destructive">
          <MessageSquareWarning className="mr-2 h-4 w-4" />
          Report Abuse
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function RequestsPage() {
    const [dialogs, setDialogs] = useState({ profile: false, rate: false, report: false });
    const [activePersonnel, setActivePersonnel] = useState("");

    const openDialog = (type: 'profile' | 'rate' | 'report', personnelName: string) => {
        setActivePersonnel(personnelName);
        setDialogs(prev => ({ ...prev, [type]: true }));
    }

    const closeDialog = (type: 'profile' | 'rate' | 'report') => {
        setDialogs(prev => ({ ...prev, [type]: false }));
    }

  const findResult = (requestId: string): TestResult | undefined => {
    return mockTestResults.find((r) => r.requestId === requestId);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Test Requests</CardTitle>
        <CardDescription>
          Track and manage all your ongoing and past test requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Personnel</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTestRequests.map((request) => {
              const result =
                request.status === "Completed"
                  ? findResult(request.id)
                  : undefined;
              return (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.testName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[request.status]}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {request.personnelName ? (
                      <PersonnelActions personnelName={request.personnelName} onOpenDialog={openDialog} />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {request.requestDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {request.status === "Completed" && result ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              View Results
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="font-headline">
                                Test Results
                              </DialogTitle>
                              <DialogDescription>
                                {result.testName} - {result.date}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <h4 className="font-semibold mb-2 text-foreground">
                                Analysis Details
                              </h4>
                              <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-sm">
                                <div className="font-medium text-muted-foreground col-span-2">
                                  Analyte
                                </div>
                                <div className="font-medium text-muted-foreground text-right">
                                  Value
                                </div>
                                <div className="font-medium text-muted-foreground text-right">
                                  Reference Range
                                </div>

                                {Object.entries(result.results).map(
                                  ([key, res]) => (
                                    <React.Fragment key={key}>
                                      <div className="col-span-2 flex items-center gap-2">
                                        <span>{key}</span>
                                        <ResultBadge flag={res.flag} />
                                      </div>
                                      <div className="text-right font-mono text-foreground">
                                        {res.value}
                                      </div>
                                      <div className="text-right font-mono text-muted-foreground">
                                        {res.range}
                                      </div>
                                    </React.Fragment>
                                  )
                                )}
                              </div>
                              <div className="mt-6 pt-4 border-t">
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  Analysis performed by:
                                  <PersonnelActions personnelName={result.personnelName} onOpenDialog={openDialog} />
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Download PDF</Button>
                              <Button>Close</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Progress
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="font-headline">
                                Request Progress
                              </DialogTitle>
                              <DialogDescription>
                                {request.testName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="my-4">
                              <ol className="relative border-s border-border">
                                {progressSteps.map((step, index) => (
                                  <li key={step} className="mb-10 ms-4">
                                    <div
                                      className={`absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 border border-white ${
                                        index <= request.progress.step
                                          ? "bg-primary"
                                          : "bg-muted"
                                      }`}
                                    ></div>
                                    <time className="mb-1 text-sm font-normal leading-none text-muted-foreground">
                                      {index <= request.progress.step
                                        ? request.requestDate
                                        : ""}
                                    </time>
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {step}
                                    </h3>
                                    {index === request.progress.step && (
                                      <p className="text-base font-normal text-muted-foreground">
                                        {request.progress.details}
                                      </p>
                                    )}
                                  </li>
                                ))}
                              </ol>
                            </div>
                            {request.status === "Allocated" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="secondary">
                                    Verify Sample Collection
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Confirm Sample Collection
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Please confirm that the lab personnel has
                                      collected your sample. This action cannot
                                      be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </DialogContent>
                        </Dialog>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          {request.status === "Pending" && (
                            <Button
                              size="sm"
                              className="bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                              Pay
                            </Button>
                          )}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="font-headline">
                              Complete Payment
                            </DialogTitle>
                            <DialogDescription>
                              Enter your M-Pesa phone number to complete the
                              payment for your test request.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="text-center">
                              <p className="text-muted-foreground">
                                Amount to Pay
                              </p>
                              <p className="text-4xl font-bold font-headline text-primary">
                                $45.00
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">
                                M-Pesa Phone Number
                              </Label>
                              <Input
                                id="phone"
                                placeholder="e.g., 254712345678"
                              />
                            </div>
                            <div className="text-center p-4 bg-muted rounded-md">
                              <p className="text-sm text-muted-foreground">
                                Or use Paybill:
                              </p>
                              <p className="font-semibold">
                                Business No:{" "}
                                <span className="font-bold text-primary">
                                  123456
                                </span>
                              </p>
                              <p className="font-semibold">
                                Account No:{" "}
                                <span className="font-bold text-primary">{`REQ-${request.id
                                  .slice(0, 4)
                                  .toUpperCase()}`}</span>
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                              Initiate Payment
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FilePenLine className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <PersonnelProfileDialog open={dialogs.profile} onOpenChange={() => closeDialog('profile')} personnelName={activePersonnel} />
    <RatePersonnelDialog open={dialogs.rate} onOpenChange={() => closeDialog('rate')} personnelName={activePersonnel} />
    <ReportAbuseDialog open={dialogs.report} onOpenChange={() => closeDialog('report')} personnelName={activePersonnel} />
    </>
  );
}
