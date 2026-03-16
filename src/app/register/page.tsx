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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerify = () => {
    toast({
      title: "Success!",
      description: "Account created successfully.",
    });
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <Card className="border-none shadow-none bg-transparent">
          {step === 1 && (
            <form onSubmit={handleRegister}>
              <CardHeader className="px-0 text-center">
                <CardTitle className="text-2xl font-headline font-bold">Join the Mission</CardTitle>
                <CardDescription>Select your role to get started</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Select onValueChange={setRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chw">Community Health Worker (CHW)</SelectItem>
                      <SelectItem value="clinician">Healthcare Clinician</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email or Phone</Label>
                  <Input id="email" placeholder="email@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
              </CardContent>
              <CardFooter className="px-0 flex flex-col gap-4 mt-4">
                <Button type="submit" className="w-full bg-primary h-12 text-lg" disabled={!role}>
                  Register
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-primary hover:underline">
                    Log In
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}

          {step === 2 && (
            <>
              <CardHeader className="px-0 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-headline mt-4">Verify Identity</CardTitle>
                <CardDescription>Enter the code sent to your device</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">6-Digit Code</Label>
                  <Input id="otp" type="text" placeholder="000000" className="text-center text-2xl tracking-widest" maxLength={6} />
                </div>
              </CardContent>
              <CardFooter className="px-0 flex flex-col gap-4">
                <Button className="w-full bg-primary h-12 text-lg" onClick={handleVerify}>
                  Complete Setup
                </Button>
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
