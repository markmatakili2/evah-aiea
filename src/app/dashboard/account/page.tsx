'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogOut, Settings, Bell, Shield, MapPin, Globe } from "lucide-react";
import { mockCHWProfile } from "@/lib/mock-data";
import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center py-6 text-center gap-3">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-primary/10 overflow-hidden shadow-xl">
            <img src={mockCHWProfile.imageUrl} alt="Profile" className="object-cover h-full w-full" />
          </div>
          <div className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-background shadow-lg">
            <Settings className="h-4 w-4 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-headline font-bold text-primary">{mockCHWProfile.name}</h1>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{mockCHWProfile.role.toUpperCase()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="border-none shadow-sm bg-card/50">
          <CardContent className="p-0 divide-y">
            <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Notifications</span>
              </div>
              <div className="bg-red-500 h-5 w-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold">3</div>
            </div>
            <div className="p-4 flex items-center gap-3 group cursor-pointer hover:bg-muted/30">
              <div className="p-2 rounded-lg bg-orange-50">
                <Globe className="h-5 w-5 text-orange-600" />
              </div>
              <span className="font-medium">Language Settings (Swahili)</span>
            </div>
            <div className="p-4 flex items-center gap-3 group cursor-pointer hover:bg-muted/30">
              <div className="p-2 rounded-lg bg-green-50">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <span className="font-medium">Work Area: {mockCHWProfile.location}</span>
            </div>
            <div className="p-4 flex items-center gap-3 group cursor-pointer hover:bg-muted/30 text-destructive">
              <div className="p-2 rounded-lg bg-red-50">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>
              <Link href="/login" className="font-medium">Log Out</Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">App Version 1.0.4-beta</p>
          <p className="text-[10px] text-muted-foreground mt-1">© 2024 AI Epilepsy Assistant</p>
        </div>
      </div>
    </div>
  );
}
