'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useUser, useDoc } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { PageLoader } from '@/components/ui/loader';

export default function SafetyDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: profile } = useDoc(user ? doc(db, 'users', user.uid) : null);
  
  const [demoRole, setDemoRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In Demo Mode, the role is stored in localStorage by the login page
    setDemoRole(localStorage.getItem('demo_role'));
  }, []);

  // Supervisor only sees aggregate data
  const patientsQuery = query(collection(db, 'patients'));
  const { data: patients, loading: patientsLoading } = useCollection(patientsQuery);

  if (!isClient || patientsLoading) return <PageLoader />;

  // Allow access if either the DB profile OR the current Demo Role is supervisor
  const isSupervisor = demoRole === 'supervisor' || profile?.role === 'supervisor';

  if (!isSupervisor) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">This dashboard is restricted to supervisors. (Current Session Role: {demoRole || 'CHW'})</p>
      </div>
    );
  }

  const urgentCount = patients?.filter(p => p.status === 'Urgent').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-headline font-bold text-primary">Safety & Discordance</h1>
        <p className="text-sm text-muted-foreground">Monitoring AI vs Clinical Judgment</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="p-4 pb-0"><AlertTriangle className="h-5 w-5 text-red-600" /></CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold text-red-600">12%</div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Override Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="p-4 pb-0"><TrendingUp className="h-5 w-5 text-primary" /></CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold text-primary">{urgentCount}</div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">High Risk Cases</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Discordance Analysis</CardTitle>
          <CardDescription>Top reasons for clinical overrides</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Patient Context missed by AI</span>
              <Badge variant="outline">45%</Badge>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[45%]" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Local Protocol Variance</span>
              <Badge variant="outline">30%</Badge>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[30%]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/30 p-4 rounded-xl border border-dashed text-center">
        <ShieldAlert className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs font-medium text-muted-foreground">Audit logs are synced every 24h to the central safety dashboard.</p>
      </div>
    </div>
  );
}
