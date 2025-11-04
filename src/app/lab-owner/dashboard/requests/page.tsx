
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTestRequests } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User, MessageSquare, Star, MessageSquareWarning, CheckCircle, MapPin, Clock } from "lucide-react";
import type { TestRequestStatus } from "@/lib/types";
import { format } from "date-fns";

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


const PersonnelActions = ({ personnelName }: { personnelName: string }) => {
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
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageSquare className="mr-2 h-4 w-4" />
          Message
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Star className="mr-2 h-4 w-4" />
          Rate Personnel
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <MessageSquareWarning className="mr-2 h-4 w-4" />
          Report Abuse
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function LabRequestsPage() {
    const labRequests = mockTestRequests.filter(req => req.lab.id === 'lab1');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Incoming Requests</CardTitle>
        <CardDescription>
          View and manage all test requests assigned to your lab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {labRequests.map(req => (
                    <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.patient.name.split(' ')[0]}. {req.patient.name.split(' ')[1][0]}</TableCell>
                        <TableCell>{req.testName}</TableCell>
                        <TableCell>
                            {req.personnelName ? <PersonnelActions personnelName={req.personnelName} /> : <Badge variant="outline">Pending</Badge>}
                        </TableCell>
                        <TableCell>
                            <Badge variant={req.status === 'Pending' ? 'destructive' : 'secondary'} className={req.status !== 'Pending' ? 'bg-green-100 text-green-800' : ''}>
                                {req.status === 'Pending' ? 'No' : 'Yes'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                             <Badge variant={statusVariant[req.status]}>
                                {req.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                           {req.status === 'Sample Collected' ? '30 mins' : 'N/A'}
                        </TableCell>
                         <TableCell className="text-right">
                             <div className="flex items-center justify-end gap-2">
                                {req.status === 'Sample Collected' && (
                                    <>
                                        <Button size="sm" variant="outline"><MapPin className="h-4 w-4 mr-2" />Track</Button>
                                        <Button size="sm"><CheckCircle className="h-4 w-4 mr-2" />Confirm Arrival</Button>
                                    </>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
