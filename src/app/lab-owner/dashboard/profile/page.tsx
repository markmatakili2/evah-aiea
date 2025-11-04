
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export default function LabProfilePage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="font-headline">Lab Profile & Verification</CardTitle>
            <CardDescription>
            Manage your lab's details and verification status.
            </CardDescription>
        </div>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Verified
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="lab-name">Lab Name</Label>
                <Input id="lab-name" defaultValue="City Central Labs" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="reg-number">Registration Number</Label>
                <Input id="reg-number" defaultValue="L-REG-98765" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="license-number">License Number</Label>
                <Input id="license-number" defaultValue="L-LIC-54321" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="kmlttb-cert">KMLTTB Certification</Label>
                <Input id="kmlttb-cert" defaultValue="KMLTTB-C-2024-001" />
            </div>
            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Lab Address</Label>
                <Input id="address" defaultValue="123 Health St, Downtown" />
            </div>
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
