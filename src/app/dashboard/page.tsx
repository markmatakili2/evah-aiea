
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Users, 
  AlertTriangle, 
  MoreVertical, 
  UserPlus, 
  History, 
  Shield, 
  Activity, 
  MapPin,
  ClipboardList,
  UserCheck,
  Stethoscope,
  Building2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { mockPatients, mockUserProfile, mockCHWs, mockClinicians, mockHealthFacilities } from "@/lib/mock-data";

export default function Dashboard() {
  const [role, setRole] = useState<string>('chw');
  const [patients, setPatients] = useState<any[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  
  useEffect(() => {
    const savedRole = localStorage.getItem('demo_role');
    const demoFlag = localStorage.getItem('is_demo') === 'true';
    if (savedRole) setRole(savedRole);
    setIsDemo(demoFlag);
    
    if (demoFlag) {
      setPatients(mockPatients);
    } else {
      setPatients([]);
    }
  }, []);

  const isSupervisor = role === 'supervisor';
  const isClinician = role === 'clinician';
  const urgentCount = patients.filter(p => p.status === 'Urgent').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-headline font-bold text-primary">
          Habari, {mockUserProfile.firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSupervisor ? "System Supervision & Monitoring" : isClinician ? "Clinical Review & CHW Oversight" : "AI Epilepsy Assistant Dashboard"}
        </p>
      </div>

      {(isSupervisor || isClinician) && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/10 col-span-2">
            <CardHeader className="p-4 pb-0">
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-3xl font-bold text-primary">{isDemo ? '1,240' : '0'}</div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Regional Patient Registry</p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="p-4 pb-0">
              <Stethoscope className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-2xl font-bold text-primary">{isDemo ? mockClinicians.length : '0'}</div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Clinicians</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="p-4 pb-0">
              <UserCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-2xl font-bold text-primary">{isDemo ? mockCHWs.length : '0'}</div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">CHWs in Circle</p>
            </CardContent>
          </Card>

          {isSupervisor && (
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader className="p-4 pb-0">
                <Building2 className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-2xl font-bold text-primary">{isDemo ? mockHealthFacilities.length : '0'}</div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Health Facilities</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-red-50 border-red-100">
            <CardHeader className="p-4 pb-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Urgent Alerts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {!isSupervisor && !isClinician && (
        <Button asChild size="lg" className="w-full h-16 text-lg font-headline gap-3 shadow-lg shadow-primary/20">
          <Link href="/dashboard/new-encounter">
            <UserPlus className="h-6 w-6" />
            New Encounter
          </Link>
        </Button>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-bold text-primary">
            {isSupervisor || isClinician ? "Active Case Registry" : "Registered Patients"}
          </h2>
          <Link href="/dashboard/records" className="text-xs font-semibold text-primary/60 hover:text-primary">
            View All
          </Link>
        </div>

        <div className="space-y-3 pb-10">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <Card key={patient.id} className="border-none shadow-sm bg-card/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground uppercase">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{patient.age}Y • {patient.gender}</span>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-[10px] h-5 px-2",
                            patient.status === 'Urgent' && "bg-red-100 text-red-700",
                            patient.status === 'Stable' && "bg-green-100 text-green-700",
                            patient.status === 'Follow-up' && "bg-blue-100 text-blue-700",
                          )}
                        >
                          {patient.status}
                        </Badge>
                      </div>
                      {(isClinician || isSupervisor) && patient.chwName && (
                        <p className="text-[10px] font-bold text-primary/60 uppercase">CHW: {patient.chwName}</p>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {!isSupervisor && !isClinician && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/new-encounter?patientId=${patient.id}`}>
                            <UserPlus className="mr-2 h-4 w-4" /> Start Encounter
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/records/${patient.id}/history`}>
                          <History className="mr-2 h-4 w-4" /> View History
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-10 text-center border-2 border-dashed rounded-xl bg-muted/10">
              <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground font-medium">No patients found in your registry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
