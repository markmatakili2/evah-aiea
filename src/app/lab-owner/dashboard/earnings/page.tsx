
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LabEarningsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Lab's Earnings</CardTitle>
        <CardDescription>
          Track your revenue and manage payouts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Earnings details and withdrawal options will be here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
