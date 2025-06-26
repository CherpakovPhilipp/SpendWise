
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { observer } from "mobx-react-lite";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Budget } from "@/lib/definitions";
import { useApp } from "@/context/AppProvider";

const budgetSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(2, "Category must be at least 2 characters."),
  goal: z.coerce.number().positive("Goal must be a positive number."),
});

type EditBudgetSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Budget | Omit<Budget, "id" | "spent">) => void;
  budget: Budget | null;
};

export const EditBudgetSheet = observer(({
  isOpen,
  onClose,
  onSave,
  budget,
}: EditBudgetSheetProps) => {
  const store = useApp();
  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
  });

  React.useEffect(() => {
    if (isOpen) {
        if (budget) {
            form.reset({
                id: budget.id,
                category: budget.category,
                goal: budget.goal,
            });
        } else {
            form.reset({
                id: "",
                category: "",
                goal: 0,
            });
        }
    }
  }, [budget, form, isOpen]);

  const onSubmit = (values: z.infer<typeof budgetSchema>) => {
    if (values.id) {
        onSave({
            ...budget!,
            ...values,
        });
    } else {
        const { id, ...dataWithoutId } = values;
        onSave(dataWithoutId);
    }
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
                   {budget ? (
                    <FormControl>
                      <Input readOnly disabled {...field} />
                    </FormControl>
                  ) : (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {store.availableBudgetCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                  )}
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
});
