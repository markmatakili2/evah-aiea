
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mockTestRequests } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function AvailablePatientsPage() {
  const { toast } = useToast();
  const availableRequests = mockTestRequests.filter(req => req.status === 'Pending');

  const handleTakeRequest = (request: typeof availableRequests[0]) => {
    toast({
      title: "Request Assigned!",
      description: `Patient ${request.patient.name} has been assigned to you.`,
    });
    // Here you would typically update the state or call an API
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Available Patient Requests</CardTitle>
        <CardDescription>
          A list of patients requesting tests in your area.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Proximity</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.patient.name}</div>
                  <div className="text-sm text-muted-foreground">{request.patient.email}</div>
                  <div className="text-sm text-muted-foreground">{request.patient.phone}</div>
                </TableCell>
                <TableCell>{request.testName}</TableCell>
                <TableCell>{request.lab.name}</TableCell>
                <TableCell>{request.patient.proximity}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" onClick={() => handleTakeRequest(request)}>
                    Take Request
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {availableRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No available patient requests in your area right now.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
