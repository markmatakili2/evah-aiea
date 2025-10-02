import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <MessageSquare className="w-6 h-6" /> Chat
        </CardTitle>
        <CardDescription>
          Communicate with lab personnel regarding your test requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <MessageSquare className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Select a conversation to start chatting</p>
        </div>
      </CardContent>
    </Card>
  );
}
