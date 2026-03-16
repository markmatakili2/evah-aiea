'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, MessageSquare, History, Sparkles } from "lucide-react";

export default function AssessPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-headline font-bold text-primary">New Assessment</h1>
        <p className="text-sm text-muted-foreground">AI-guided diagnostic tools for epilepsy.</p>
      </div>

      <div className="grid gap-4">
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Mic className="h-24 w-24" />
          </div>
          <CardHeader>
            <div className="bg-accent/20 w-fit p-2 rounded-lg mb-2">
              <Mic className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">Voice Input</CardTitle>
            <CardDescription className="text-primary-foreground/70">
              Record seizure descriptions in Swahili or local dialects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full font-bold">Start Recording</Button>
          </CardContent>
        </Card>

        <Card className="border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader>
            <div className="bg-primary/10 w-fit p-2 rounded-lg mb-2">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">Guided Prompt</CardTitle>
            <CardDescription>
              Step-by-step questionnaire following WHO guidelines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full font-bold">Start Questionnaire</Button>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-dashed border-accent/30">
          <CardContent className="p-6 flex flex-col items-center text-center gap-3">
            <div className="bg-accent/20 p-3 rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-headline font-bold text-primary">Recent Insights</h3>
            <p className="text-sm text-muted-foreground">
              Your AI Assistant is ready to analyze new cases and provide triage recommendations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
