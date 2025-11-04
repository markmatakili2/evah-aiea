
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight font-headline mb-6">
        Super Admin Dashboard
      </h1>
      <Card>
        <CardHeader>
            <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <p>Dashboard statistics and charts will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
