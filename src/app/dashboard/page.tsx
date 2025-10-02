import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestCard } from "@/components/dashboard/test-card";
import { mockTests, mockUserProfile } from "@/lib/mock-data";
import { RequestTestDialog } from "@/components/dashboard/request-test-dialog";

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight font-headline">
                Welcome back, {mockUserProfile.firstName}!
            </h1>
            <p className="text-muted-foreground">
                Here's a list of available tests. You can request a test or search for a specific one.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <RequestTestDialog>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Request a Test
                    </span>
                </Button>
            </RequestTestDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockTests.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </>
  );
}
