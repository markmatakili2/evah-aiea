
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
import { format } from "date-fns";

export default function LabHistoryPage() {
    const completedRequests = mockTestRequests.filter(req => req.status === 'Completed' && req.lab.id === 'lab1');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Request History</CardTitle>
        <CardDescription>
          A log of all completed tests and their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {completedRequests.map(req => (
                     <TableRow key={req.id}>
                        <TableCell className="font-mono text-xs">{req.id}</TableCell>
                        <TableCell>{req.patient.name}</TableCell>
                        <TableCell>{req.testName}</TableCell>
                        <TableCell>{req.personnelName}</TableCell>
                        <TableCell>{format(new Date(req.collectionDate!), 'PPP')}</TableCell>
                        <TableCell className="text-right font-medium">Ksh 3500.00</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
