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
import { UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function VerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    toast({
        title: "Submission Received",
        description: "Your verification details have been submitted for approval.",
    });

    // Navigate to profile page with a status to indicate pending state
    router.push('/technician/dashboard/profile?status=pending');
  };

  return (
    <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Complete Your Verification</CardTitle>
                <CardDescription>
                Please provide the following details and documents to verify your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="id-number">National ID or Passport Number</Label>
                            <Input id="id-number" placeholder="Enter your ID/Passport number" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="Enter your email" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="license-number">Medical License Number</Label>
                            <Input id="license-number" placeholder="e.g., KMLTTB/LIC/12345" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registration-number">Registration Number</Label>
                            <Input id="registration-number" placeholder="e.g., A12345" required />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <Label>ID/Passport Upload</Label>
                             <div className="flex items-center justify-center w-full mt-2">
                                <label htmlFor="id-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    </div>
                                    <Input id="id-upload" type="file" className="hidden" required />
                                </label>
                            </div> 
                        </div>
                         <div>
                            <Label>License Document Upload</Label>
                             <div className="flex items-center justify-center w-full mt-2">
                                <label htmlFor="license-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    </div>
                                    <Input id="license-upload" type="file" className="hidden" required />
                                </label>
                            </div> 
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-accent text-accent-foreground" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
