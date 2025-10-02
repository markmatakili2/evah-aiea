import type { Test } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlaskConical } from "lucide-react";
import { RequestTestDialog } from "./request-test-dialog";

interface TestCardProps {
  test: Test;
}

export function TestCard({ test }: TestCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="font-headline text-lg">{test.name}</CardTitle>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <FlaskConical className="w-5 h-5 text-primary"/>
            </div>
        </div>
        <CardDescription>{test.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-bold font-headline text-primary">${test.price}</p>
      </CardContent>
      <CardFooter>
        <RequestTestDialog>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Request This Test
            </Button>
        </RequestTestDialog>
      </CardFooter>
    </Card>
  );
}
