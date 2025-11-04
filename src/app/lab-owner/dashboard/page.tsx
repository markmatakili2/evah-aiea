
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

export default function LabOwnerDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight font-headline mb-6">
        Lab Owner Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Requests</CardTitle>
            <CardDescription>Requests needing attention.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-4xl font-bold">8</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/lab-owner/dashboard/requests">
                View Requests <ArrowRight className="ml-2 h-4 w-4" />
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
            <p className="text-4xl font-bold">Ksh 45,800</p>
             <Button asChild variant="outline" size="sm">
              <Link href="/lab-owner/dashboard/earnings">
                View Earnings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Ongoing Tasks</CardTitle>
            <CardDescription>Tests currently in analysis.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
             <p className="text-4xl font-bold">12</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Total Tests Offered</CardTitle>
            <CardDescription>Number of tests in your catalog.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
             <p className="text-4xl font-bold">25</p>
             <Button asChild variant="outline" size="sm">
                <Link href="/lab-owner/dashboard/my-tests">
                    Manage Tests <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
             </Button>
          </CardContent>
        </Card>
      </div>
       <div className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of recent events in your lab.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">Placeholder for recent activity feed...</p>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
