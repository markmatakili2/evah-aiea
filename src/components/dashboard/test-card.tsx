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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlaskConical, ChevronDown } from "lucide-react";
import { RequestTestDialog } from "./request-test-dialog";
import { mockLabs } from "@/lib/mock-data";

interface TestCardProps {
  test: Test;
}

export function TestCard({ test }: TestCardProps) {
  const getLabName = (labId: string) => {
    return mockLabs.find((lab) => lab.id === labId)?.name || "Unknown Lab";
  };

  const startingPrice = Math.min(...test.prices.map(p => p.price));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-lg">{test.name}</CardTitle>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <FlaskConical className="w-5 h-5 text-primary" />
          </div>
        </div>
        <CardDescription>{test.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
         <p className="text-sm text-muted-foreground">Starting from</p>
         <p className="text-2xl font-bold font-headline text-primary">
            ${startingPrice.toFixed(2)}
         </p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              View Prices
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuLabel>Prices per Lab</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {test.prices.map(({ labId, price }) => (
              <DropdownMenuItem key={labId} className="flex justify-between">
                <span>{getLabName(labId)}</span>
                <span className="font-semibold">${price.toFixed(2)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <RequestTestDialog test={test}>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Request This Test
          </Button>
        </RequestTestDialog>
      </CardFooter>
    </Card>
  );
}
