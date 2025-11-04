
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts & Payments</CardTitle>
        <CardDescription>
          Approve payments and view financial reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Payment approval requests and reports will be here.</p>
            <Button className="mt-4">View Payout Queue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
