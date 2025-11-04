
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Wallet } from "lucide-react";
import { mockTestRequests } from "@/lib/mock-data";
import { format } from "date-fns";
import { useState } from "react";
import { WithdrawalDialog } from "@/components/technician/withdrawal-dialog";

export default function EarningsPage() {
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);

  const completedTasks = mockTestRequests.filter(
    (req) => req.personnelId === "tech1" && req.status === "Completed"
  );
  
  const totalEarnings = 12500;

  return (
    <>
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wallet className="w-6 h-6" /> My Earnings
          </CardTitle>
          <CardDescription>
            View your earnings history and manage withdrawals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Available for Withdrawal</CardTitle>
                    <Wallet className="w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Ksh {totalEarnings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+20% from last month</p>
                </CardContent>
              </Card>
               <Card className="flex flex-col justify-center items-center p-6 bg-accent/10">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsWithdrawalDialogOpen(true)}>
                        Withdraw Funds
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Withdrawals are processed within 24 hours.</p>
              </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Earnings History</h3>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Completed Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {completedTasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.testName}</TableCell>
                            <TableCell>{task.patient.name}</TableCell>
                            <TableCell>
                                {task.progress.find(p => p.status === 'Completed') 
                                    ? format(new Date(task.progress.find(p => p.status === 'Completed')!.date), 'PPP') 
                                    : 'N/A'
                                }
                            </TableCell>
                            <TableCell className="text-right font-medium">Ksh 2500.00</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
          </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button size="sm" variant="outline" className="ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Download Statement
            </Button>
        </CardFooter>
      </Card>
    </div>
    <WithdrawalDialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen} />
    </>
  );
}
