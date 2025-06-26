
"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BudgetGoals } from "@/components/dashboard/budget-goals";
import { EditTransactionSheet } from "@/components/transactions/edit-transaction-sheet";
import { Transaction } from "@/lib/definitions";
import { useApp } from "@/context/AppProvider";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { transactions, saveTransaction, loading } = useApp();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);

  const handleAdd = () => {
    setSelectedTransaction(null);
    setIsEditDialogOpen(true);
  };

  const handleSave = async (updatedTransaction: Transaction | Omit<Transaction, "id">) => {
    await saveTransaction(updatedTransaction);
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleSheetClose = () => {
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  };

  if (loading) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="mt-2 h-4 w-64" />
              </div>
              <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-36" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-3">
              <Skeleton className="lg:col-span-2 h-[400px]" />
              <Skeleton className="lg:col-span-1 h-[400px]" />
            </div>
             <Skeleton className="h-96" />
        </div>
    )
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
        <Header onAdd={handleAdd} transactions={transactions} />
        <div className="grid gap-6 md:gap-8">
          <OverviewCards />
          <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SpendingChart />
            </div>
            <div className="lg:col-span-1">
              <BudgetGoals />
            </div>
          </div>
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
      <EditTransactionSheet
        isOpen={isEditDialogOpen}
        onClose={handleSheetClose}
        onSave={handleSave}
        transaction={selectedTransaction}
      />
    </>
  );
}
