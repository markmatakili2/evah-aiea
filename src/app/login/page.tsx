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
import { Loader2, Key, UserCheck, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Manual Login: Marks session as NOT demo
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('demo_session', 'true');
      localStorage.setItem('is_demo', 'false'); // Non-demo session
      const role = email.includes('supervisor') ? 'supervisor' : email.includes('clinician') ? 'clinician' : 'chw';
      localStorage.setItem('demo_role', role);
      toast({ title: 'Login Success', description: `Logged in as ${role.toUpperCase()}` });
      router.push('/dashboard');
    }, 1000);
  };

  const handleDemoLogin = (role: string) => {
    // Demo Login: Marks session as demo
    localStorage.setItem('demo_session', 'true');
    localStorage.setItem('is_demo', 'true'); // Demo session enabled
    localStorage.setItem('demo_role', role);
    toast({ title: 'Demo Mode Activated', description: `Accessing clinical prototype as ${role.toUpperCase()}` });
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-12">
          <Logo />
        </div>
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0 text-center">
            <CardTitle className="text-3xl font-headline font-bold text-primary">Welcome Back</CardTitle>
            <CardDescription className="text-lg">Secure Access for Care Teams</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.ai" 
                  className="h-12 text-lg" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-sm text-primary/60 font-semibold cursor-pointer">Forgot?</span>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  className="h-12 text-lg" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-primary h-14 text-xl font-headline shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Log In'}
              </Button>
            </form>

            <div className="pt-6 border-t mt-6">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-3 text-center tracking-widest">Prototype Demo Accounts</p>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="text-[10px] h-14 flex flex-col gap-1" onClick={() => handleDemoLogin('chw')}>
                  <UserCheck className="h-4 w-4 text-blue-600" /> CHW
                </Button>
                <Button variant="outline" size="sm" className="text-[10px] h-14 flex flex-col gap-1" onClick={() => handleDemoLogin('clinician')}>
                  <Key className="h-4 w-4 text-green-600" /> Clinician
                </Button>
                <Button variant="outline" size="sm" className="text-[10px] h-14 flex flex-col gap-1" onClick={() => handleDemoLogin('supervisor')}>
                  <Shield className="h-4 w-4 text-purple-600" /> Supervisor
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-0 flex flex-col gap-6 mt-6">
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
