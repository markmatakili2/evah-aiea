'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, History, UserPlus, AlertCircle } from "lucide-react";
import { mockPatients } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function RecordsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold text-primary tracking-tight">Patient Records</h1>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search name or ID..." className="pl-10 h-12 bg-muted/30 border-none focus-visible:ring-primary" />
      </div>

      <div className="space-y-3 pb-4">
        {mockPatients.map((patient) => (
          <Card key={patient.id} className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{patient.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{patient.village} • {patient.contact}</p>
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
                  <span className="text-[10px] text-muted-foreground">ID: {patient.id.toUpperCase()}</span>
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
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/new-encounter?patientId=${patient.id}`}>
                      <UserPlus className="mr-2 h-4 w-4" /> Start Encounter
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/new-encounter?patientId=${patient.id}&startAt=redflags`}>
                      <AlertCircle className="mr-2 h-4 w-4" /> Quick Red Flags
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/records/${patient.id}/history`}>
                      <History className="mr-2 h-4 w-4" /> View History
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
