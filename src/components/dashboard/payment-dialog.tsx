
'use client';

import { useState } from 'react';
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
import { CheckCircle2, Loader2, Smartphone, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testName: string;
  labName: string;
  amount: number;
  requestId: string;
}

type PaymentStatus = 'idle' | 'pending' | 'authorizing' | 'confirming' | 'success' | 'error';

const statusSteps: { status: PaymentStatus, icon: React.ElementType, message: string }[] = [
    { status: 'pending', icon: Loader2, message: 'Sending request to your phone...' },
    { status: 'authorizing', icon: Smartphone, message: 'Please enter your M-Pesa PIN on your phone to authorize.' },
    { status: 'confirming', icon: Loader2, message: 'Confirming payment, please wait...' },
    { status: 'success', icon: CheckCircle2, message: 'Payment Successful!' },
    { status: 'error', icon: XCircle, message: 'Payment Failed. Please try again.' },
];

export function PaymentDialog({
  open,
  onOpenChange,
  testName,
  labName,
  amount,
  requestId,
}: PaymentDialogProps) {
    const { toast } = useToast();
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [activeTab, setActiveTab] = useState('mpesa');

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
           setTimeout(() => setPaymentStatus('idle'), 300); // Reset on close with delay for animation
        }
        onOpenChange(isOpen);
    }

    const handlePayment = () => {
        setPaymentStatus('pending');
        setTimeout(() => setPaymentStatus('authorizing'), 2000);
        setTimeout(() => setPaymentStatus('confirming'), 7000);
        setTimeout(() => {
            setPaymentStatus('success');
            toast({
                title: "Payment Confirmed",
                description: "Your test request is now being processed.",
            });
        }, 10000);
    }

    const handleInsuranceSubmit = () => {
        toast({
            title: "Insurance Details Submitted",
            description: "Your insurance information is being verified. We will notify you shortly.",
        });
        handleOpenChange(false);
    }
    
    const currentStep = statusSteps.findIndex(step => step.status === paymentStatus);
    const success = paymentStatus === 'success';
    const error = paymentStatus === 'error';


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Complete Payment</DialogTitle>
          <DialogDescription>
            {testName} at {labName}
          </DialogDescription>
        </DialogHeader>
        
        {paymentStatus === 'idle' ? (
        <>
            <div className="text-center my-4">
                <p className="text-muted-foreground">Amount to Pay</p>
                <p className="text-4xl font-bold font-headline text-primary">
                Ksh {amount.toFixed(2)}
                </p>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
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
        </>
        ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                {statusSteps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep || success;
                    
                    const Icon = step.icon;

                    if (step.status === 'success' && !success) return null;
                    if (step.status === 'error' && !error) return null;

                    return (
                        <div key={step.status} className={cn("flex items-center gap-4 w-full transition-opacity duration-300", isActive ? "opacity-100" : "opacity-40")}>
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2",
                                isCompleted ? "border-green-500 bg-green-500 text-white" : "border-primary text-primary",
                                error && "border-destructive bg-destructive text-white"
                            )}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className={cn("w-5 h-5", (isActive || isCompleted) && 'animate-spin' )} />}
                            </div>
                            <p className={cn("font-medium", isActive && "text-primary")}>
                                {step.message}
                            </p>
                        </div>
                    )
                })}
                 {(success || error) && (
                    <Button onClick={() => handleOpenChange(false)} className="mt-6">
                        Close
                    </Button>
                )}
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
