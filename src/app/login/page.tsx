'use client';

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

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-12">
          <Logo />
        </div>
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0 text-center">
            <CardTitle className="text-3xl font-headline font-bold text-primary">Welcome Back</CardTitle>
            <CardDescription className="text-lg">Secure Access for Health Workers</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input id="email" type="text" placeholder="m@example.com" className="h-12 text-lg" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary/60 hover:text-primary font-semibold">
                  Forgot?
                </Link>
              </div>
              <Input id="password" type="password" className="h-12 text-lg" required />
            </div>
          </CardContent>
          <CardFooter className="px-0 flex flex-col gap-6 mt-6">
            <Button className="w-full bg-primary h-14 text-xl font-headline shadow-lg shadow-primary/20" asChild>
              <Link href="/dashboard">Log In</Link>
            </Button>
            <div className="text-center text-sm text-muted-foreground font-medium">
              Not registered?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline underline-offset-4">
                Join the Mission
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
