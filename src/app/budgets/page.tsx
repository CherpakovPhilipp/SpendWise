
"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetsTable } from "@/components/budgets/budgets-table";
import { EditBudgetSheet } from "@/components/budgets/edit-budget-sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { budgets as mockBudgets, Budget } from "@/data/mock";

export default function BudgetsPage() {
  const [budgets, setBudgets] = React.useState(mockBudgets);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedBudget, setSelectedBudget] =
    React.useState<Budget | null>(null);

  const handleAdd = () => {
    setSelectedBudget(null);
    setIsEditDialogOpen(true);
  };

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBudget) {
      setBudgets(
        budgets.filter((b) => b.id !== selectedBudget.id)
      );
    }
    setIsDeleteDialogOpen(false);
    setSelectedBudget(null);
  };

  const handleSave = (updatedBudget: Budget) => {
    if (selectedBudget) {
      // Editing existing
      setBudgets(
        budgets.map((b) =>
          b.id === updatedBudget.id ? updatedBudget : b
        )
      );
    } else {
      // Adding new
      setBudgets([
        { ...updatedBudget, spent: 0, id: `bud${Date.now()}` },
        ...budgets,
      ]);
    }
    setIsEditDialogOpen(false);
    setSelectedBudget(null);
  };

  const handleSheetClose = () => {
    setIsEditDialogOpen(false);
    setSelectedBudget(null);
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Budgets
            </h1>
            <p className="text-muted-foreground">
              View and manage all your budgets.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </div>
        </div>
        <BudgetsTable
          budgets={budgets}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <EditBudgetSheet
        isOpen={isEditDialogOpen}
        onClose={handleSheetClose}
        onSave={handleSave}
        budget={selectedBudget}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
