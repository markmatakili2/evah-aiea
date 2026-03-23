
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  History, 
  UserPlus, 
  AlertCircle, 
  Users, 
  Shield, 
  UserCircle, 
  Building2, 
  PlusCircle,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { mockPatients, mockClinicians, mockCHWs, mockHealthFacilities } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function RecordsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState<string>('chw');
  const [activeTab, setActiveTab] = useState("patients");
  const [isDemo, setIsDemo] = useState(false);
  const [showAddHospital, setShowAddHospital] = useState(false);

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
  const facilities = isDemo ? mockHealthFacilities : [];

  const handleApprove = (name: string) => {
    toast({
      title: "Account Approved",
      description: `${name}'s account has been verified and activated for the regional circle.`,
    });
  };

  const handleOnboardHospital = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddHospital(false);
    toast({
      title: "Hospital Onboarded",
      description: "Facility has been added to the regional referral registry.",
    });
  };

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

  const filteredFacilities = facilities.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold text-primary tracking-tight italic">
          {isSupervisor ? "Regional Management" : "Regional Registry"}
        </h1>
        {isSupervisor && activeTab === 'facilities' && (
          <Button size="sm" className="gap-2" onClick={() => setShowAddHospital(true)}>
            <PlusCircle className="h-4 w-4" /> Add Hospital
          </Button>
        )}
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
          <TabsList className={cn(
            "grid w-full bg-muted/50 p-1 rounded-xl h-12",
            isSupervisor ? "grid-cols-4" : "grid-cols-3"
          )}>
            <TabsTrigger value="patients" className="rounded-lg text-[10px] sm:text-xs">Patients</TabsTrigger>
            <TabsTrigger value="clinicians" className="rounded-lg text-[10px] sm:text-xs">Clinicians</TabsTrigger>
            <TabsTrigger value="chws" className="rounded-lg text-[10px] sm:text-xs">CHWs</TabsTrigger>
            {isSupervisor && <TabsTrigger value="facilities" className="rounded-lg text-[10px] sm:text-xs">Facilities</TabsTrigger>}
          </TabsList>

          <TabsContent value="patients" className="space-y-3 mt-4">
            {filteredPatients.map(patient => (
              <PatientCard key={patient.id} patient={patient} isRestricted={isSupervisor} />
            ))}
          </TabsContent>

          <TabsContent value="clinicians" className="space-y-3 mt-4">
            {filteredClinicians.map(clinician => (
              <Card key={clinician.id} className="border-none shadow-sm bg-card/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">{clinician.name}</h3>
                      <Badge variant={clinician.status === 'Approved' ? 'secondary' : 'outline'} className="text-[8px] h-4">
                        {clinician.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{clinician.role} • {clinician.hospital}</p>
                  </div>
                  {isSupervisor && clinician.status === 'Pending' && (
                    <Button size="sm" onClick={() => handleApprove(clinician.name)} className="bg-green-600 hover:bg-green-700 h-8 text-[10px] font-bold">
                      Approve
                    </Button>
                  )}
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">{chw.name}</h3>
                      <Badge variant={chw.status === 'Approved' ? 'secondary' : 'outline'} className="text-[8px] h-4">
                        {chw.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Sector: {chw.sector} • {chw.activePatients} Patients</p>
                  </div>
                  {isSupervisor && chw.status === 'Pending' && (
                    <Button size="sm" onClick={() => handleApprove(chw.name)} className="bg-green-600 hover:bg-green-700 h-8 text-[10px] font-bold">
                      Approve
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {isSupervisor && (
            <TabsContent value="facilities" className="space-y-3 mt-4">
              {filteredFacilities.map(facility => (
                <Card key={facility.id} className="border-none shadow-sm bg-card/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{facility.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">{facility.type} Pathway</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {facility.coordinates.lat.toFixed(4)}, {facility.coordinates.lng.toFixed(4)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remove Facility</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="space-y-3 pb-4">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} isRestricted={false} />
          ))}
        </div>
      )}

      {/* Onboarding Dialog */}
      <Dialog open={showAddHospital} onOpenChange={setShowAddHospital}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline italic text-primary">Onboard Health Facility</DialogTitle>
            <DialogDescription>Register a new referral destination hospital or specialist unit.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOnboardHospital} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Hospital Name</Label>
                <Input placeholder="e.g. Regional Referral Unit" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input placeholder="Specialist / District" required />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input placeholder="+254..." required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" placeholder="referrals@hospital.org" required />
              </div>
              <div className="space-y-2">
                <Label>Address / physical Location</Label>
                <Input placeholder="Sub-county, Street, etc." required />
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input placeholder="-1.2345" type="number" step="any" required />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input placeholder="36.7890" type="number" step="any" required />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full h-12 font-bold bg-primary shadow-lg shadow-primary/20">
                Register Facility
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
