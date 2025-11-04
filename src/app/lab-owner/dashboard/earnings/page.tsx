
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockTestRequests, mockWithdrawals } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function LabEarningsPage() {
    const completedRequests = mockTestRequests.filter(req => req.status === 'Completed' && req.lab.id === 'lab1');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Lab's Earnings</CardTitle>
        <CardDescription>
          Track your revenue and manage payouts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>This Month's Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">Ksh 45,800</p>
                    <p className="text-sm text-muted-foreground">+15.2% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Pending Payout</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">Ksh 12,300</p>
                    <p className="text-sm text-muted-foreground">Next payout on {format(new Date().setDate(new Date().getDate() + 5), 'PPP')}</p>
                </CardContent>
            </Card>
            <div className="flex flex-col gap-4">
                <Button size="lg" className="h-full">Request Payout</Button>
                <Button size="lg" variant="outline">Payout Settings</Button>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {completedRequests.slice(0, 5).map(req => (
                        <TableRow key={req.id}>
                            <TableCell>{format(new Date(req.progress.find(p => p.status === 'Completed')?.date!), 'PPP')}</TableCell>
                            <TableCell>{req.testName}</TableCell>
                            <TableCell>{req.patient.name}</TableCell>
                            <TableCell className="text-right font-medium">Ksh 3500.00</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

      </CardContent>
        <CardFooter className="border-t pt-4">
             <Button variant="outline" size="sm" className="ml-auto">
                <Download className="h-4 w-4 mr-2" />
                Download Statement
            </Button>
        </CardFooter>
    </Card>
  );
}
