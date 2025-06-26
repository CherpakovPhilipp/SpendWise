
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Budget } from "@/data/mock";

const budgetSchema = z.object({
  id: z.string(),
  category: z.string().min(2, "Category must be at least 2 characters."),
  goal: z.coerce.number().positive("Goal must be a positive number."),
  spent: z.coerce.number().min(0, "Spent must be a non-negative number."),
});

type EditBudgetSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Budget) => void;
  budget: Budget | null;
};

export function EditBudgetSheet({
  isOpen,
  onClose,
  onSave,
  budget,
}: EditBudgetSheetProps) {
  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
  });

  React.useEffect(() => {
    if (isOpen) {
        if (budget) {
            form.reset(budget);
        } else {
            form.reset({
                id: "",
                category: "",
                goal: 0,
                spent: 0,
            });
        }
    }
  }, [budget, form, isOpen]);

  const onSubmit = (values: z.infer<typeof budgetSchema>) => {
    onSave(values);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{budget ? "Edit Budget" : "Add Budget"}</SheetTitle>
          <SheetDescription>
            {budget
              ? "Update the details of your budget."
              : "Create a new budget goal."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Groceries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="500.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Spent</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Save changes</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
