
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" y1="8" x2="12" y2="8" />
      <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
      <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
  );
}

export default function TechnicianRegisterPage() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleProceedToVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSendCode = () => {
    toast({
      title: "Code Sent!",
      description: "An OTP code has been sent to your phone number.",
    });
  };

  const handleVerify = () => {
    toast({
      title: "Verification Successful!",
      description: "Please review our terms of service.",
    });
    setStep(3);
  };

  const handleFinishRegistration = () => {
    toast({
      title: "Registration Complete!",
      description: "Welcome! Please complete your profile verification to start accepting requests.",
      duration: 5000,
    });
    router.push('/technician/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="flex justify-center mb-6">
          <Logo />
        </Link>
        <Card className="shadow-2xl">
          {step === 1 && (
            <form onSubmit={handleProceedToVerification}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Technician Registration</CardTitle>
                <CardDescription>Join our network of certified lab professionals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" type="button">
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Sign up with Google
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 234 567 890" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Register
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/technician/login" className="font-semibold text-primary hover:underline">
                    Log In
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}

          {step === 2 && (
             <>
              <CardHeader className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-headline mt-4">Verify Your Phone Number</CardTitle>
                <CardDescription>A verification code has been sent to {phoneNumber}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input id="otp" type="text" placeholder="Enter 6-digit code" maxLength={6} />
                </div>
                <Button type="button" variant="link" className="text-sm p-0 h-auto" onClick={handleSendCode}>
                  Resend Code
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="button" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleVerify}>
                  Verify Phone Number
                </Button>
                 <Button variant="link" onClick={() => setStep(1)}>
                    Back to registration
                </Button>
              </CardFooter>
            </>
          )}
          
           {step === 3 && (
             <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Terms of Service</CardTitle>
                <CardDescription>Please read and accept our terms before proceeding.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 w-full rounded-md border p-4">
                    <h3 className="font-bold mb-2">1. Service Provider Agreement</h3>
                    <p className="text-sm">By registering as a technician, you agree to uphold the highest standards of professionalism, safety, and patient confidentiality. You confirm that you are a certified and licensed professional in your jurisdiction.</p>
                    <h3 className="font-bold mt-4 mb-2">2. Penalties for Service Providers</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>A 10% penalty fee will be charged on the Medical Lab Officer for any delay in locating the client within a window of 15 minutes.</li>
                        <li>10% of the cost of the test will be charged on any clinical lab registered with DIGI-LAB SOLUTIONS LTD for any inconvenience in conducting the requested lab investigation. This rule is exclusive of circumstances limited to natural calamities.</li>
                    </ul>
                     <p className="text-sm mt-4">For the full terms, please visit our <Link href="/terms-of-service" target="_blank" className="text-primary underline">Terms of Service page</Link>.</p>
                </ScrollArea>
                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" onCheckedChange={(checked) => setAgreed(!!checked)} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        I have read and agree to the technician terms of service.
                    </label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="button" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleFinishRegistration} disabled={!agreed}>
                  Finish Registration
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
