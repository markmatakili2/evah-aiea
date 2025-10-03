
'use client';

import { useState, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestCard } from "@/components/dashboard/test-card";
import { mockTests, mockUserProfile } from "@/lib/mock-data";
import { RequestTestDialog } from "@/components/dashboard/request-test-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Test } from "@/lib/types";

const TEST_CATEGORIES = ['All', 'Hematology', 'Biochemistry', 'Microbiology', 'Serology', 'Endocrinology'];
const INITIAL_VISIBLE_TESTS = 4;

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleTestsCount, setVisibleTestsCount] = useState(INITIAL_VISIBLE_TESTS);

  const filteredTests = useMemo(() => {
    if (selectedCategory === 'All') {
      return mockTests;
    }
    return mockTests.filter(test => test.category === selectedCategory);
  }, [selectedCategory]);

  const visibleTests = filteredTests.slice(0, visibleTestsCount);
  const hasMoreTests = visibleTestsCount < filteredTests.length;

  const handleLoadMore = () => {
    setVisibleTestsCount(prevCount => prevCount + INITIAL_VISIBLE_TESTS);
  };
  
  const handleCategoryChange = (category: string) => {
      setSelectedCategory(category);
      setVisibleTestsCount(INITIAL_VISIBLE_TESTS); // Reset count on category change
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight font-headline">
                Welcome back, {mockUserProfile.firstName}!
            </h1>
            <p className="text-muted-foreground">
                Here's a list of available tests. You can request a test or search for a specific one.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    {TEST_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <RequestTestDialog>
                <Button size="sm" className="h-9 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Request a Test
                    </span>
                </Button>
            </RequestTestDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleTests.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>

      {visibleTests.length === 0 && (
        <div className="text-center col-span-full py-12">
            <p className="text-muted-foreground">No tests found for the selected category.</p>
        </div>
      )}

      {hasMoreTests && (
        <div className="flex justify-center mt-6">
            <Button onClick={handleLoadMore}>Load More</Button>
        </div>
      )}
    </>
  );
}
