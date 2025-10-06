
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TechnicianChatPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>
          Communicate with patients and lab managers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Chat interface will be here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
