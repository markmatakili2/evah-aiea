'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, History, UserPlus, AlertCircle, Users, Shield, UserCircle, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { mockPatients, mockClinicians, mockCHWs } from "@/lib/mock-data";

export default function RecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState<string>('chw');
  const [activeTab, setActiveTab] = useState("patients");
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('demo_role');
    const demoFlag = localStorage.getItem('is_demo') === 'true';
    if (savedRole) setRole(savedRole);
    setIsDemo(demoFlag);
  }, []);

  const isSupervisor = role === 'supervisor';
  const isClinician = role === 'clinician';

  const patients = isDemo ? mockPatients : [];
  const clinicians = isDemo ? mockClinicians : [];
  const chws = isDemo ? mockCHWs : [];

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClinicians = clinicians.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCHWs = chws.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold text-primary tracking-tight italic">Regional Registry</h1>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={`Search ${activeTab}...`} 
          className="pl-10 h-12 bg-muted/30 border-none focus-visible:ring-primary rounded-xl" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {(isSupervisor || isClinician) ? (
        <Tabs defaultValue="patients" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-12">
            <TabsTrigger value="patients" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Patients</TabsTrigger>
            <TabsTrigger value="clinicians" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Clinicians</TabsTrigger>
            <TabsTrigger value="chws" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">CHWs</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-3 mt-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <PatientCard key={patient.id} patient={patient} isRestricted={true} />
              ))
            ) : (
              <div className="py-20 text-center text-muted-foreground italic">No patient records available.</div>
            )}
          </TabsContent>

          <TabsContent value="clinicians" className="space-y-3 mt-4">
            {filteredClinicians.map(clinician => (
              <Card key={clinician.id} className="border-none shadow-sm bg-card/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{clinician.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{clinician.role} • {clinician.hospital}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical className="h-5 w-5" /></Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="chws" className="space-y-3 mt-4">
            {filteredCHWs.map(chw => (
              <Card key={chw.id} className="border-none shadow-sm bg-card/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <UserCircle className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{chw.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Sector: {chw.sector} • {chw.activePatients} Patients</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical className="h-5 w-5" /></Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-3 pb-4">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} isRestricted={false} />
            ))
          ) : (
            <div className="py-20 text-center text-muted-foreground bg-muted/10 rounded-2xl border-2 border-dashed">
              <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm font-medium">No patients registered in your local registry.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PatientCard({ patient, isRestricted }: { patient: any, isRestricted: boolean }) {
  return (
    <Card className="border-none shadow-sm bg-card/50 hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
          {patient.name?.charAt(0) || 'P'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{patient.name}</h3>
          <div className="flex flex-col gap-0.5 mt-0.5">
            <p className="text-[10px] text-muted-foreground">{patient.location}</p>
            {patient.chwName && (
              <p className="text-[10px] font-bold text-primary/60 uppercase">CHW: {patient.chwName}</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="outline" 
              className={cn(
                "text-[9px] uppercase tracking-wider font-bold h-5 px-2",
                patient.status === 'Urgent' && "border-red-200 bg-red-50 text-red-700",
                patient.status === 'Stable' && "border-green-200 bg-green-50 text-green-700",
                patient.status === 'Follow-up' && "border-blue-200 bg-blue-50 text-blue-700",
              )}
            >
              {patient.status}
            </Badge>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Patient Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isRestricted && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/new-encounter?patientId=${patient.id}`}>
                    <UserPlus className="mr-2 h-4 w-4" /> New Assessment
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/new-encounter?patientId=${patient.id}&startAt=redflags`}>
                    <AlertCircle className="mr-2 h-4 w-4" /> Quick Red Flags
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/records/${patient.id}/history`}>
                <History className="mr-2 h-4 w-4" /> Full Clinical History
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
