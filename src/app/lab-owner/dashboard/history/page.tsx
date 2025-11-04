
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LabHistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Request History</CardTitle>
        <CardDescription>
          A log of all completed tests and their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">A table of completed requests will be displayed here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
