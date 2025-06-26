
"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BudgetGoals } from "@/components/dashboard/budget-goals";
import { EditTransactionSheet } from "@/components/transactions/edit-transaction-sheet";
import { transactions as mockTransactions, Transaction } from "@/data/mock";

export default function Home() {
  const [transactions, setTransactions] = React.useState(mockTransactions);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);

  const handleAdd = () => {
    setSelectedTransaction(null);
    setIsEditDialogOpen(true);
  };

  const handleSave = (updatedTransaction: Transaction) => {
    if (selectedTransaction) {
      // Editing existing
      setTransactions(
        transactions.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        )
      );
    } else {
      // Adding new
      setTransactions([
        { ...updatedTransaction, id: `txn${Date.now()}` },
        ...transactions,
      ]);
    }
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleSheetClose = () => {
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  };

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
