
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
import { Budget } from "@/lib/definitions";
import { useApp } from "@/context/AppProvider";
import { Skeleton } from "@/components/ui/skeleton";


export default function BudgetsPage() {
  const { budgets, saveBudget, deleteBudget, loading } = useApp();
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

  const confirmDelete = async () => {
    if (selectedBudget) {
      await deleteBudget(selectedBudget.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedBudget(null);
  };

  const handleSave = async (updatedBudget: Budget | Omit<Budget, "id">) => {
    await saveBudget(updatedBudget);
    setIsEditDialogOpen(false);
    setSelectedBudget(null);
  };

  const handleSheetClose = () => {
    setIsEditDialogOpen(false);
    setSelectedBudget(null);
  };

  if (loading) {
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
            <div className="flex items-center">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="mt-2 h-4 w-64" />
                </div>
                <div className="ml-auto">
                    <Skeleton className="h-9 w-36" />
                </div>
            </div>
            <Skeleton className="h-[400px] w-full" />
        </div>
      )
  }

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
