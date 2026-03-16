'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users, AlertTriangle, ChevronRight, UserPlus } from "lucide-react";
import { mockPatients, mockCHWProfile } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CHWDashboard() {
  const urgentCount = mockPatients.filter(p => p.status === 'Urgent').length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-headline font-bold text-primary">
          Habari, {mockCHWProfile.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Reporting from {mockCHWProfile.location}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="p-4 pb-0">
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="text-2xl font-bold text-primary">{mockPatients.length}</div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Patients</p>
          </CardContent>
        </Card>
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

      {/* Primary Action */}
      <Button asChild size="lg" className="w-full h-16 text-lg font-headline gap-3 shadow-lg shadow-primary/20">
        <Link href="/dashboard/records?add=true">
          <UserPlus className="h-6 w-6" />
          New Encounter
        </Link>
      </Button>

      {/* Registered Patients List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-bold text-primary">Registered Patients</h2>
          <Link href="/dashboard/records" className="text-xs font-semibold text-primary/60 hover:text-primary">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {mockPatients.length > 0 ? (
            mockPatients.slice(0, 4).map((patient) => (
              <Card key={patient.id} className="group hover:bg-muted/50 transition-colors cursor-pointer border-none shadow-sm bg-card/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground uppercase">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
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
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed">
              No patients registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
