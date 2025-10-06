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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type VerificationStatus = 'Unverified' | 'Pending' | 'Verified';

const TechnicianProfileContent = () => {
    const searchParams = useSearchParams();
    const statusParam = searchParams.get('status') as VerificationStatus;
    const [status, setStatus] = useState<VerificationStatus>('Unverified');

    useEffect(() => {
        if (statusParam === 'pending') {
            setStatus('Pending');
            const timer = setTimeout(() => {
                setStatus('Verified');
            }, 3 * 60 * 1000); // 3 minutes
            return () => clearTimeout(timer);
        } else if (statusParam === 'verified') {
            setStatus('Verified');
        }
    }, [statusParam]);


    const VerificationStatusBadge = () => {
        switch (status) {
            case 'Verified':
                return (
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                        <BadgeCheck className="w-4 h-4 mr-2" />
                        Verified
                    </Badge>
                );
            case 'Pending':
                return (
                     <Badge variant="secondary">
                        Pending Approval
                    </Badge>
                );
            case 'Unverified':
            default:
                return (
                    <Link href="/technician/dashboard/profile/verify">
                         <Badge variant="destructive" className="cursor-pointer hover:bg-destructive/80">
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            Unverified
                        </Badge>
                    </Link>
                );
        }
    }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                 <CardTitle className="font-headline">My Profile</CardTitle>
                <CardDescription>
                View and edit your technician profile details here.
                </CardDescription>
            </div>
            <VerificationStatusBadge />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
                <AvatarImage src="https://picsum.photos/seed/tech-profile/200" data-ai-hint="profile person" />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
                <Button>Change Photo</Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" defaultValue="John" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" defaultValue="Doe" />
            </div>
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="tech@example.com" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+254 712 345 678" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="licence">Licence Number</Label>
                <Input id="licence" defaultValue="KMLTTB/LIC/12345" readOnly={status !== 'Unverified'} />
            </div>
        </div>

        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
      </CardContent>
    </Card>
  );
}

export default function TechnicianProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TechnicianProfileContent />
        </Suspense>
    )
}
