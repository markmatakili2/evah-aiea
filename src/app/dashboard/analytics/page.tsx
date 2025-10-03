'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { mockTestRequests, mockTests } from '@/lib/mock-data';
import { useMemo } from 'react';
import { Activity } from 'lucide-react';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AnalyticsPage() {
  const testStatusData = useMemo(() => {
    const statusCounts = mockTestRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, []);

  const testCategoryData = useMemo(() => {
    const categoryCounts = mockTestRequests.reduce((acc, request) => {
      const test = mockTests.find(t => t.id === request.testId);
      if (test) {
        acc[test.category] = (acc[test.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  }, []);

  const monthlyTestData = useMemo(() => {
    const monthCounts = mockTestRequests.reduce((acc, request) => {
      const month = new Date(request.requestDate).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return sortedMonths.map(month => ({
      name: month,
      tests: monthCounts[month] || 0,
    })).filter(d => d.tests > 0);
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Test Request Status</CardTitle>
          <CardDescription>Distribution of your test requests by status.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={testStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                         {testStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Test Categories</CardTitle>
          <CardDescription>Breakdown of tests by medical category.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                       <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={testCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {testCategoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Monthly Test Trends</CardTitle>
          <CardDescription>Number of tests requested per month.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{
                tests: {
                    label: 'Tests',
                    color: 'hsl(var(--chart-1))',
                },
            }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyTestData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                        <RechartsTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="tests" fill="var(--color-tests)" radius={8} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
