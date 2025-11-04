
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Package, User } from "lucide-react";
import { mockTestRequests } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

const recentActivities = [
  { id: 1, icon: Package, text: "New request for CBC from A. Miller", time: new Date(Date.now() - 3600000), href: "/lab-owner/dashboard/requests" },
  { id: 2, icon: User, text: "Technician John D. accepted Lipid Panel task.", time: new Date(Date.now() - 3600000 * 2), href: "/lab-owner/dashboard/requests" },
  { id: 3, icon: CheckCircle, text: "TSH results for M. Garcia uploaded.", time: new Date(Date.now() - 3600000 * 5), href: "/lab-owner/dashboard/history" },
];


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
              <Clock className="h-8 w-8 text-muted-foreground" />
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
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <Link key={activity.id} href={activity.href}>
                                <div className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-md transition-colors">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <activity.icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{activity.text}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(activity.time, { addSuffix: true })}
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
