
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { mockTests } from "@/lib/mock-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Test } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const TEST_CATEGORIES = ['Hematology', 'Biochemistry', 'Microbiology', 'Serology', 'Endocrinology'];

const AddEditTestDialog = ({ test, onOpenChange, open }: { test?: Test, onOpenChange: (open: boolean) => void, open: boolean }) => {
    const { toast } = useToast();
    const isEditMode = !!test;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onOpenChange(false);
        toast({
            title: isEditMode ? "Test Updated" : "Test Added",
            description: `The test details have been successfully ${isEditMode ? 'updated' : 'added'}.`,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
             <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? "Edit Test" : "Add New Test"}</DialogTitle>
                        <DialogDescription>
                            {isEditMode ? "Update the details for this test." : "Fill in the details for the new test."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="test-name">Test Name</Label>
                            <Input id="test-name" defaultValue={test?.name} placeholder="e.g., Complete Blood Count" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="test-category">Category</Label>
                            <Select defaultValue={test?.category}>
                                <SelectTrigger id="test-category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TEST_CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="test-price">Price (Ksh)</Label>
                            <Input id="test-price" type="number" defaultValue={test?.prices[0]?.price} placeholder="e.g., 3500" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">{isEditMode ? "Save Changes" : "Add Test"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export default function MyTestsPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<Test | undefined>(undefined);
    const { toast } = useToast();

    const handleEdit = (test: Test) => {
        setEditingTest(test);
    };

    const handleDelete = (test: Test) => {
        toast({
            title: "Test Deleted",
            description: `"${test.name}" has been removed from your lab's offerings.`,
            variant: "destructive"
        });
    }

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline">My Lab's Tests</CardTitle>
            <CardDescription>
                Manage the tests offered by your laboratory.
            </CardDescription>
        </div>
        <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Test
            </Button>
        </DialogTrigger>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockTests.map((test) => (
                    <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.name}</TableCell>
                        <TableCell><Badge variant="outline">{test.category}</Badge></TableCell>
                        <TableCell>Ksh {test.prices.find(p => p.labId === 'lab1')?.price.toFixed(2) || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => handleEdit(test)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                             </DropdownMenu>
                              <AlertDialog>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the "{test.name}" test.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(test)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
    <AddEditTestDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    {editingTest && <AddEditTestDialog open={!!editingTest} onOpenChange={() => setEditingTest(undefined)} test={editingTest} />}
    </>
  );
}
