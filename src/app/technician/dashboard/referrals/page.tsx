
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
import { useEffect, useState } from "react";

export default function TechnicianReferralsPage() {
  const { toast } = useToast();
  const referralCode = "JOHND-T3CH1";
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    // Ensure this runs only on the client-side where `window` is available
    setReferralLink(`${window.location.origin}/technician/register?ref=${referralCode}`);
  }, [referralCode]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Your referral link has been copied to the clipboard.",
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Users className="w-6 h-6" /> Refer a Technician
          </CardTitle>
          <CardDescription>
            Share your unique link and earn bonuses when your friends sign up and complete their first task.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-primary">Your Unique Referral Link</h3>
            <div className="flex items-center justify-center gap-2 my-4">
              <Input
                readOnly
                value={referralLink}
                className="text-lg font-mono text-center h-12 bg-background max-w-md"
              />
              <Button size="icon" onClick={handleCopyLink} disabled={!referralLink}>
                <Copy className="w-5 h-5" />
                <span className="sr-only">Copy Link</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Share this link with other certified lab technicians!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-accent/10 border-accent">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">technicians joined</p>
                </CardContent>
              </Card>
               <Card className="bg-green-500/10 border-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Available Bonuses</CardTitle>
                    <Gift className="w-4 h-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Ksh 1000</div>
                    <Button size="sm" className="mt-1 h-auto py-1">Claim Now</Button>
                </CardContent>
              </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Referred Technicians</h3>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Technician</TableHead>
                        <TableHead>Date Joined</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Jane S.</TableCell>
                            <TableCell>{format(new Date('2024-07-18T00:00:00Z'), "PPP")}</TableCell>
                            <TableCell>
                            <Badge
                                variant="secondary"
                                className='bg-green-100 text-green-800'
                            >
                                First Task Completed
                            </Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Peter K.</TableCell>
                            <TableCell>{format(new Date('2024-07-20T00:00:00Z'), "PPP")}</TableCell>
                            <TableCell>
                            <Badge
                                variant="outline"
                            >
                                Verified
                            </Badge>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
