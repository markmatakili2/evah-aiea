import {
  MoreHorizontal,
  FilePenLine,
  XCircle,
  CreditCard,
  Truck,
  Loader,
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
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { mockTestRequests } from "@/lib/mock-data";
import type { TestRequestStatus } from "@/lib/types";

const statusVariant: Record<TestRequestStatus, "default" | "secondary" | "destructive" | "outline"> = {
    Pending: "outline",
    Allocated: "default",
    'Sample Collected': 'default',
    'In Analysis': 'default',
    Completed: 'secondary',
    Cancelled: 'destructive'
};

const statusColor: Record<TestRequestStatus, string> = {
    Pending: 'border-yellow-500 text-yellow-500',
    Allocated: 'bg-blue-500 text-white',
    'Sample Collected': 'bg-cyan-500 text-white',
    'In Analysis': 'bg-purple-500 text-white',
    Completed: 'bg-green-500 text-white',
    Cancelled: 'bg-red-500 text-white'
}


const progressSteps = [
    'Pending', 'Allocated', 'Sample Collected', 'In Analysis', 'Completed'
];

export default function RequestsPage() {
  return (
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
            {mockTestRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.testName}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {request.personnelName || "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {request.requestDate}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Progress</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-headline">Request Progress</DialogTitle>
                                <DialogDescription>{request.testName}</DialogDescription>
                            </DialogHeader>
                            <div className="my-4">
                                <ol className="relative border-s border-border">
                                    {progressSteps.map((step, index) => (
                                        <li key={step} className="mb-10 ms-4">
                                            <div className={`absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 border border-white ${index <= request.progress.step ? 'bg-primary' : 'bg-muted'}`}></div>
                                            <time className="mb-1 text-sm font-normal leading-none text-muted-foreground">{index <= request.progress.step ? request.requestDate : ''}</time>
                                            <h3 className="text-lg font-semibold text-foreground">{step}</h3>
                                            {index === request.progress.step && <p className="text-base font-normal text-muted-foreground">{request.progress.details}</p>}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            {request.status === 'Allocated' && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="secondary">Verify Sample Collection</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Sample Collection</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Please confirm that the lab personnel has collected your sample. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Confirm</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                           {request.status === 'Pending' && <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Pay</Button>}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="font-headline">Complete Payment</DialogTitle>
                                <DialogDescription>Enter your M-Pesa phone number to complete the payment for your test request.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="text-center">
                                    <p className="text-muted-foreground">Amount to Pay</p>
                                    <p className="text-4xl font-bold font-headline text-primary">$45.00</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">M-Pesa Phone Number</Label>
                                    <Input id="phone" placeholder="e.g., 254712345678" />
                                </div>
                                <div className="text-center p-4 bg-muted rounded-md">
                                    <p className="text-sm text-muted-foreground">Or use Paybill:</p>
                                    <p className="font-semibold">Business No: <span className="font-bold text-primary">123456</span></p>
                                    <p className="font-semibold">Account No: <span className="font-bold text-primary">{`REQ-${request.id.slice(0,4).toUpperCase()}`}</span></p>
                                </div>
                            </div>
                            <DialogFooter>
                                 <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Initiate Payment</Button>
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
                        <DropdownMenuItem><FilePenLine className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive"><XCircle className="h-4 w-4 mr-2" />Cancel</DropdownMenuItem>
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
