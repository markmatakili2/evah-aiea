
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TechnicianDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight font-headline mb-6">
        Technician Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Patients</CardTitle>
            <CardDescription>Number of patients currently assigned.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Earnings</CardTitle>
            <CardDescription>Your earnings for this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">Ksh 12,500</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Matches</CardTitle>
            <CardDescription>Patients near you needing tests.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-4xl font-bold">3</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
