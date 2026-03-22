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
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-headline font-bold text-primary italic">Secure Clinical Communication</h1>
        <p className="text-sm text-muted-foreground">Coordination between CHWs, Clinicians, and Supervisors.</p>
      </div>

      <Card className="border-none shadow-sm bg-card/50">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-lg text-primary">
            <MessageSquare className="w-5 h-5" /> Care Team Chat
          </CardTitle>
          <CardDescription>
            Discuss patient management or referral coordination.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-2xl bg-muted/10">
              <div className="bg-primary/5 p-6 rounded-full mb-4">
                <MessageSquare className="w-12 h-12 text-primary/30" />
              </div>
              <p className="text-muted-foreground font-medium">Select a team member to start a clinical discussion.</p>
              <p className="text-xs text-muted-foreground mt-1 italic">Governance note: All clinical chats are archived for audit.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}