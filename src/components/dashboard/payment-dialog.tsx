
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testName: string;
  labName: string;
  amount: number;
  requestId: string;
}

export function PaymentDialog({
  open,
  onOpenChange,
  testName,
  labName,
  amount,
  requestId,
}: PaymentDialogProps) {
    const { toast } = useToast();

    const handlePayment = () => {
        toast({
            title: "Payment Initiated",
            description: "Please check your phone to complete the M-Pesa payment.",
        });
        onOpenChange(false);
    }

    const handleInsuranceSubmit = () => {
        toast({
            title: "Insurance Details Submitted",
            description: "Your insurance information is being verified. We will notify you shortly.",
        });
        onOpenChange(false);
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Complete Payment</DialogTitle>
          <DialogDescription>
            {testName} at {labName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center my-4">
            <p className="text-muted-foreground">Amount to Pay</p>
            <p className="text-4xl font-bold font-headline text-primary">
            Ksh {amount.toFixed(2)}
            </p>
        </div>

        <Tabs defaultValue="mpesa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
          </TabsList>
          <TabsContent value="mpesa">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <Input id="phone" placeholder="e.g., 254712345678" />
              </div>
              <div className="text-center p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">Or use Paybill:</p>
                <p className="font-semibold">
                  Business No:{' '}
                  <span className="font-bold text-primary">123456</span>
                </p>
                <p className="font-semibold">
                  Account No:{' '}
                  <span className="font-bold text-primary">{`REQ-${requestId
                    .slice(0, 4)
                    .toUpperCase()}`}</span>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handlePayment}>
                Initiate Payment
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="insurance">
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="insurance-provider">Insurance Provider</Label>
                    <Input id="insurance-provider" placeholder="e.g., Jubilee Insurance" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="policy-number">Policy Number</Label>
                    <Input id="policy-number" placeholder="Enter your policy number" />
                </div>
            </div>
             <DialogFooter>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleInsuranceSubmit}>
                Submit for Verification
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
