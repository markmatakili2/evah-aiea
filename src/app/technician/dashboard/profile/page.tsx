
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TechnicianProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>
          View and edit your technician profile details here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Profile details and verification status will be displayed here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
