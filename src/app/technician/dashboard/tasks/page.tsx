
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockTestRequests } from "@/lib/mock-data";
import { Phone, MessageSquare, MapPin, Check, FileText, FilePen, Upload, Building, Clock } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { TestRequestStatus } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

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

const LabAccessDialog = ({ open, onOpenChange, labName }: { open: boolean, onOpenChange: (open: boolean) => void, labName: string }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">Lab Access Granted</DialogTitle>
                    <DialogDescription>Your request to access {labName} has been approved.</DialogDescription>
                </DialogHeader>
                <div className="py-4 text-center space-y-4">
                     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Access ID</p>
                        <p className="font-mono text-2xl font-bold">L-AC-78B3D</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Expected Arrival</p>
                        <p className="text-lg font-semibold">Within 30 minutes</p>
                    </div>
                </div>
                 <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const UploadResultsDialog = ({ open, onOpenChange, patientName }: { open: boolean, onOpenChange: (open: boolean) => void, patientName: string }) => {
    const { toast } = useToast();
    const handleSubmit = () => {
        onOpenChange(false);
        toast({
            title: "Results Uploaded",
            description: `Results for ${patientName} have been successfully submitted.`,
        });
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">Upload Test Results</DialogTitle>
                    <DialogDescription>Enter the results for {patientName}.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="analyte-1">Hemoglobin</Label>
                        <Textarea id="analyte-1" placeholder="Enter value, range, and flag (e.g., 14.5 g/dL, 13.5-17.5, Normal)" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="analyte-2">White Blood Cell</Label>
                        <Textarea id="analyte-2" placeholder="Enter value, range, and flag (e.g., 7.2 x10^9/L, 4.5-11.0, Normal)" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="general-notes">General Notes (optional)</Label>
                        <Textarea id="general-notes" placeholder="Any additional notes about the results..." />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Submit Results</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function MyTasksPage() {
  const [activeDialog, setActiveDialog] = useState< 'labAccess' | 'uploadResults' | null >(null);
  const [selectedTask, setSelectedTask] = useState<(typeof mockTestRequests)[0] | null>(null);

  const myTasks = mockTestRequests.filter(
    (req) => req.personnelId === 'tech1' && req.status !== 'Completed'
  );
  
  const completedTasks = mockTestRequests.filter(
    (req) => req.personnelId === 'tech1' && req.status === 'Completed'
  );

  const openDialog = (dialog: 'labAccess' | 'uploadResults', task: (typeof mockTestRequests)[0]) => {
    setSelectedTask(task);
    setActiveDialog(dialog);
  }

  const closeDialog = () => {
    setSelectedTask(null);
    setActiveDialog(null);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Active Tasks</CardTitle>
          <CardDescription>
            A list of all your assigned patient requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {myTasks.map((task) => (
              <AccordionItem key={task.id} value={task.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="text-left">
                      <p className="font-semibold">{task.patient.name}</p>
                      <p className="text-sm text-muted-foreground">{task.testName}</p>
                    </div>
                    <Badge variant={statusVariant[task.status]}>{task.status}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/50 rounded-b-md">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Patient Details</h4>
                        <div className="flex items-center gap-4">
                           <Image src="https://picsum.photos/seed/patient1/100/100" alt={task.patient.name} width={64} height={64} className="rounded-full" data-ai-hint="profile person" />
                           <div>
                               <p><strong>Name:</strong> {task.patient.name}</p>
                               <p><strong>Age:</strong> {task.patient.age}</p>
                               <p><strong>Gender:</strong> {task.patient.gender}</p>
                               <p><strong>Phone:</strong> {task.patient.phone?.replace(/\*/g, '5')}</p>
                               <p><strong>Email:</strong> {task.patient.email?.replace(/\*/g, 'a')}</p>
                           </div>
                        </div>
                      </div>
                       <div>
                        <h4 className="font-semibold mb-2">Request Details</h4>
                        <p><strong>Test:</strong> {task.testName}</p>
                        <p><strong>Collection Time:</strong> {format(new Date(task.requestDate), 'PPP p')}</p>
                        <p><strong>Location:</strong> Home Visit</p>
                      </div>
                    </div>
                     <div className="space-y-2 flex flex-col">
                       <h4 className="font-semibold mb-2">Actions</h4>
                        <Button><MapPin className="mr-2"/> Track Location</Button>
                        <Button variant="outline"><Phone className="mr-2"/> Call Patient</Button>
                        <Button variant="outline"><MessageSquare className="mr-2"/> Message</Button>
                        <Button variant="secondary" className="mt-4"><Check className="mr-2"/> Confirm Sample Collection</Button>
                        <Button variant="secondary" onClick={() => openDialog('labAccess', task)}><Building className="mr-2"/> Request Lab Access</Button>
                        <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => openDialog('uploadResults', task)}><Upload className="mr-2"/> Upload Results</Button>
                        <Button variant="destructive" size="sm" className="mt-auto">Cancel Request</Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
             {myTasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">You have no active tasks.</div>
             )}
          </Accordion>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Completed Tasks</CardTitle>
          <CardDescription>
            Your past completed tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Test</TableHead>
                        <TableHead>Completed On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {completedTasks.map(task => (
                        <TableRow key={task.id}>
                            <TableCell>{task.patient.name}</TableCell>
                            <TableCell>{task.testName}</TableCell>
                            <TableCell>{task.progress.find(p => p.status === 'Completed') ? format(new Date(task.progress.find(p => p.status === 'Completed')!.date), 'PPP') : 'N/A'}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm"><FileText className="mr-2 h-3 w-3"/> View Results</Button>
                                <Button variant="outline" size="sm"><FilePen className="mr-2 h-3 w-3"/> Edit</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             {completedTasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">You have no completed tasks.</div>
             )}
        </CardContent>
      </Card>

        {selectedTask && (
            <>
                <LabAccessDialog 
                    open={activeDialog === 'labAccess'} 
                    onOpenChange={closeDialog}
                    labName={selectedTask.lab.name}
                />
                <UploadResultsDialog
                    open={activeDialog === 'uploadResults'}
                    onOpenChange={closeDialog}
                    patientName={selectedTask.patient.name}
                />
            </>
        )}

    </div>
  );
}
