'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone, ShieldCheck, Clock, Building2 } from 'lucide-react';
import { mockHealthFacilities } from '@/lib/mock-data';
import type { HealthFacility, UrgencyLevel } from '@/lib/clinical-engine/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface FacilityMapProps {
  urgency: UrgencyLevel;
  patientLocation?: string;
  onFacilitySelected?: (facility: HealthFacility) => void;
}

export function FacilityMap({ urgency, patientLocation, onFacilitySelected }: FacilityMapProps) {
  const [nearest, setNearest] = useState<HealthFacility | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // GIS Logic: Match required care level to nearest available facility type
    const targetType = urgency === 'EMERGENCY' ? 'specialist' : urgency === 'URGENT' ? 'district' : 'local';
    
    // In a real app, we would use haversine formula here with real coordinates
    const filtered = mockHealthFacilities.filter(f => f.type === targetType || (urgency === 'EMERGENCY' && f.type === 'specialist'));
    
    setTimeout(() => {
      setNearest(filtered[0] || mockHealthFacilities[0]);
      setIsLoading(false);
    }, 800);
  }, [urgency]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-muted/20 rounded-xl border border-dashed">
        <Navigation className="h-8 w-8 animate-bounce text-primary/40" />
        <p className="text-sm font-medium text-muted-foreground">Identifying nearest capable facility...</p>
      </div>
    );
  }

  if (!nearest) return null;

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg animate-in zoom-in-95 duration-300">
      <div className="relative aspect-video w-full bg-slate-200">
        {/* Mock GIS Map View */}
        <Image 
          src="https://picsum.photos/seed/location-map/800/450" 
          alt="GIS Map" 
          fill 
          className="object-cover opacity-80" 
          data-ai-hint="satellite map"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex flex-col text-white">
            <Badge className="w-fit mb-1 bg-white/20 backdrop-blur-md text-white border-white/30">
              {urgency} Care Route
            </Badge>
            <h3 className="text-lg font-bold">{nearest.name}</h3>
            <p className="text-xs opacity-90 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> 12.4 km from {patientLocation || 'Current Location'}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl ring-4 ring-white/20">
            <Navigation className="h-6 w-6" />
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded-lg">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Estimated Transit</span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold">24 Mins</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded-lg">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span className="text-sm font-bold text-green-700">Open & Ready</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Required Capabilities Verified</h4>
          <div className="flex flex-wrap gap-1">
            {nearest.capabilities.map(cap => (
              <Badge key={cap} variant="secondary" className="text-[9px] h-5 bg-primary/5 text-primary border-primary/10">
                {cap}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1 gap-2" size="sm">
            <Navigation className="h-4 w-4" /> Start Guidance
          </Button>
          <Button variant="outline" size="sm" className="shrink-0" asChild>
            <a href={`tel:${nearest.contact}`}><Phone className="h-4 w-4" /></a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
