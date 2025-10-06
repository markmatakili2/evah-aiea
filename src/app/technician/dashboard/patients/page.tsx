
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AvailablePatientsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Patients</CardTitle>
        <CardDescription>
          A list of patients requesting tests in your area.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Patient list will be displayed here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
