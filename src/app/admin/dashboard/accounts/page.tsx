
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <p>Payment approval and reporting tools will be here.</p>
      </CardContent>
    </Card>
  );
}
