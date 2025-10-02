"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, UploadCloud, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { mockLabs, mockTests } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import type { Test } from "@/lib/types";

interface RequestTestDialogProps {
  children: React.ReactNode;
  test?: Test;
}

export function RequestTestDialog({ children, test: initialTest }: RequestTestDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [selectedTest, setSelectedTest] = useState<Test | undefined>(initialTest);
  const { toast } = useToast();

  useEffect(() => {
    if (initialTest) {
      setSelectedTest(initialTest);
    }
    // Reset state if dialog is closed
    if(!open) {
      setStep(1);
      setDate(undefined);
      setSelectedTest(initialTest);
    }
  }, [initialTest, open]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  
  const handleSubmit = () => {
      setOpen(false);
      toast({
        title: "Request Submitted",
        description: "Your test request has been successfully submitted. You can track its progress in 'My Requests'.",
        className: 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600'
      });
  }

  const handleTestSelection = (testId: string) => {
    const test = mockTests.find(t => t.id === testId);
    setSelectedTest(test);
  }
  
  const getPriceForLab = (labId: string) => {
    if (!selectedTest) return null;
    const priceInfo = selectedTest.prices.find(p => p.labId === labId);
    return priceInfo ? `$${priceInfo.price.toFixed(2)}` : 'N/A';
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Request a New Test
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? "Fill in the details for your test." : "Schedule your sample collection."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="test-selection">Selected Test</Label>
              {initialTest ? (
                <Input id="test-selection" value={initialTest.name} readOnly disabled />
              ) : (
                <Select onValueChange={handleTestSelection}>
                  <SelectTrigger id="test-selection">
                    <SelectValue placeholder="Choose a test..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTests.map((test) => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms (optional)</Label>
              <Textarea
                id="symptoms"
                placeholder="e.g., fatigue, headache, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Supporting Files (optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">Doctor's prescription, past reports, etc.</p>
                    </div>
                    <Input id="file-upload" type="file" className="hidden" />
                </label>
            </div> 
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Select Point of Collection</Label>
              <RadioGroup defaultValue="home" className="flex gap-4">
                <Label htmlFor="r-home" className="flex-1 p-4 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="home" id="r-home" className="sr-only" />
                  <span className="font-semibold block">Home Collection</span>
                  <span className="text-sm text-muted-foreground">A technician will visit you.</span>
                </Label>
                <Label htmlFor="r-lab" className="flex-1 p-4 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="lab" id="r-lab" className="sr-only" />
                  <span className="font-semibold block">Visit a Lab</span>
                  <span className="text-sm text-muted-foreground">Book a slot at a nearby lab.</span>
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection-time">Preferred Time</Label>
              <Input id="collection-time" type="time" />
            </div>

            <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lab-selection">Select Lab (optional)</Label>
              <Select>
                <SelectTrigger id="lab-selection">
                  <SelectValue placeholder="Any available lab" />
                </SelectTrigger>
                <SelectContent>
                  {mockLabs.map((lab) => (
                    <SelectItem key={lab.id} value={lab.id}>
                        <div className="flex justify-between w-full">
                            <span>{lab.name}</span>
                            <span className="text-muted-foreground">{getPriceForLab(lab.id)}</span>
                        </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter className="flex-row justify-between w-full">
          {step === 1 ? <div /> : (
            <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
            </Button>
          )}

          {step === 1 && (
            <Button onClick={handleNext} disabled={!selectedTest} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Submit Request
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
