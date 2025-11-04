
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TechnicianDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight font-headline mb-6">
        Technician Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
            <CardDescription>Number of patients currently assigned.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-4xl font-bold">5</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/technician/dashboard/tasks">
                View Tasks <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Earnings</CardTitle>
            <CardDescription>Your earnings for this month.</CardDescription>
          </CardHeader>
           <CardContent className="flex items-center justify-between">
            <p className="text-4xl font-bold">Ksh 12,500</p>
             <Button asChild variant="outline" size="sm">
              <Link href="/technician/dashboard/earnings">
                View Earnings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Requests</CardTitle>
            <CardDescription>Patients near you needing tests.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
             <p className="text-4xl font-bold">3</p>
             <Button asChild variant="outline" size="sm">
                <Link href="/technician/dashboard/patients">
                    View Requests <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
