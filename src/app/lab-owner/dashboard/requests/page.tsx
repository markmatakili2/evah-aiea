
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LabRequestsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Incoming Requests</CardTitle>
        <CardDescription>
          View and manage all test requests assigned to your lab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">A table of test requests will be displayed here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
