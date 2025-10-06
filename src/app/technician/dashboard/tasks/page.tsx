
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MyTasksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>
          A list of all your assigned patient requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Assigned tasks will be displayed here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
