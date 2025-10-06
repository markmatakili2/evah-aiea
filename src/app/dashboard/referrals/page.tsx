
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, Gift, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockReferredUsers } from "@/lib/mock-data";
import { format } from 'date-fns';

export default function ReferralsPage() {
  const { toast } = useToast();
  const referralCode = "ALEXM-A4B8C";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Your referral code has been copied to the clipboard.",
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Users className="w-6 h-6" /> Referrals
          </CardTitle>
          <CardDescription>
            Share your code and earn bonuses when your friends sign up and complete their first test.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-primary">Your Unique Referral Code</h3>
            <div className="flex items-center justify-center gap-2 my-4">
              <Input
                readOnly
                value={referralCode}
                className="text-2xl font-bold font-mono tracking-widest text-center h-12 bg-background max-w-xs"
              />
              <Button size="icon" onClick={handleCopyCode}>
                <Copy className="w-5 h-5" />
                <span className="sr-only">Copy Code</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Share this code with your friends!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-accent/10 border-accent">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{mockReferredUsers.length}</div>
                    <p className="text-xs text-muted-foreground">friends joined</p>
                </CardContent>
              </Card>
               <Card className="bg-green-500/10 border-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Available Bonuses</CardTitle>
                    <Gift className="w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Ksh 500</div>
                    <Button size="sm" className="mt-1 h-auto py-1">Claim Now</Button>
                </CardContent>
              </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Referred Users</h3>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Date Joined</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockReferredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{format(new Date(user.dateJoined), "PPP")}</TableCell>
                            <TableCell>
                            <Badge
                                variant={user.status === "Completed" ? "secondary" : "outline"}
                                className={user.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                            >
                                {user.status}
                            </Badge>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
