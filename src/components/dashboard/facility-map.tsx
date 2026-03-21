'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
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
    // Logic: Match required care level to nearest capable facility
    const targetType = urgency === 'EMERGENCY' ? 'specialist' : urgency === 'URGENT' ? 'district' : 'local';
    const filtered = mockHealthFacilities.filter(f => f.type === targetType || (urgency === 'EMERGENCY' && f.type === 'specialist'));
    
    setTimeout(() => {
      setNearest(filtered[0] || mockHealthFacilities[0]);
      setIsLoading(false);
    }, 800);
  }, [urgency]);

  const openGoogleMaps = () => {
    if (!nearest) return;
    const query = encodeURIComponent(nearest.name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-muted/20 rounded-xl border border-dashed">
        <Navigation className="h-8 w-8 animate-bounce text-primary/40" />
        <p className="text-sm font-medium text-muted-foreground">Locating nearest capable facility...</p>
      </div>
    );
  }

  if (!nearest) return null;

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg animate-in zoom-in-95 duration-300">
      <div className="relative aspect-video w-full bg-slate-200 cursor-pointer" onClick={openGoogleMaps}>
        {/* IMAGE SOURCE IS SPECIFIED BELOW ON LINE 63 */}
        <Image 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800&h=450" 
          alt="KUTRRH Referral Map" 
          fill 
          className="object-cover" 
          data-ai-hint="google map"
        />
        
        {/* UI Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex flex-col text-white">
            <Badge className="w-fit mb-1 bg-white/20 backdrop-blur-md text-white border-white/30 text-[10px] font-bold uppercase tracking-wider">
              {urgency} REFERRAL PATHWAY
            </Badge>
            <h3 className="text-sm font-bold leading-tight max-w-[220px] drop-shadow-md">{nearest.name}</h3>
            <p className="text-[10px] opacity-90 flex items-center gap-1 mt-1 drop-shadow-sm">
              <MapPin className="h-2.5 w-2.5" /> Thika Rd, Nairobi, Kenya
            </p>
          </div>
          <Button size="icon" className="h-10 w-10 rounded-full bg-primary text-white shadow-2xl ring-4 ring-white/30" onClick={(e) => { e.stopPropagation(); openGoogleMaps(); }}>
            <ExternalLink className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded-lg">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Est. Transit Time</span>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold">18 Mins</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2 bg-muted/30 rounded-lg">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Facility Status</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-bold">Open & Ready</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[9px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">Specialized Capabilities</h4>
          <div className="flex flex-wrap gap-1">
            {nearest.capabilities.map(cap => (
              <Badge key={cap} variant="secondary" className="text-[8px] h-4 bg-primary/5 text-primary border-primary/10 px-1.5 py-0">
                {cap}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button className="flex-1 gap-2 text-xs font-bold h-11 bg-primary shadow-md" onClick={openGoogleMaps}>
            <Navigation className="h-4 w-4" /> Open in Google Maps
          </Button>
          <Button variant="outline" className="shrink-0 h-11 w-11 p-0 border-muted-foreground/20 hover:bg-muted" asChild>
            <a href={`tel:${nearest.contact}`}><Phone className="h-5 w-5 text-primary" /></a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
