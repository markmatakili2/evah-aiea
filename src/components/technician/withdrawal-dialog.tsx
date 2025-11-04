
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockBanks = ["KCB Bank", "Equity Bank", "Co-operative Bank", "NCBA Bank", "Stanbic Bank"];

export function WithdrawalDialog({ open, onOpenChange }: WithdrawalDialogProps) {
  const { toast } = useToast();

  const handleWithdrawalRequest = (method: 'M-Pesa' | 'Bank') => {
    onOpenChange(false);
    toast({
      title: "Withdrawal Request Sent",
      description: `Your request to withdraw via ${method} is being processed.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Request Withdrawal</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method and enter the details.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="mpesa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
          </TabsList>
          <TabsContent value="mpesa">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="mpesa-phone">Phone Number</Label>
                <Input id="mpesa-phone" placeholder="e.g., 254712345678" defaultValue="254712345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mpesa-amount">Amount</Label>
                <Input id="mpesa-amount" type="number" placeholder="Enter amount to withdraw" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" onClick={() => handleWithdrawalRequest('M-Pesa')}>
                Request M-Pesa Withdrawal
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="bank">
             <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name</Label>
                 <Select>
                    <SelectTrigger id="bank-name">
                        <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockBanks.map(bank => (
                            <SelectItem key={bank} value={bank.toLowerCase().replace(/ /g, '-')}>{bank}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input id="account-name" placeholder="Enter account name" defaultValue="John Doe" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input id="account-number" placeholder="Enter bank account number" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="bank-amount">Amount</Label>
                <Input id="bank-amount" type="number" placeholder="Enter amount to withdraw" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" onClick={() => handleWithdrawalRequest('Bank')}>
                Request Bank Withdrawal
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
