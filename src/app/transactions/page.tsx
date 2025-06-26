"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { EditTransactionSheet } from "@/components/transactions/edit-transaction-sheet";
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
import { transactions as mockTransactions, Transaction } from "@/data/mock";

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState(mockTransactions);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);

  const handleAdd = () => {
    setSelectedTransaction(null);
    setIsEditDialogOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransaction) {
      setTransactions(
        transactions.filter((t) => t.id !== selectedTransaction.id)
      );
    }
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
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
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Transactions
            </h1>
            <p className="text-muted-foreground">
              View and manage all your transactions.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>
        <TransactionsTable
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <EditTransactionSheet
        isOpen={isEditDialogOpen}
        onClose={handleSheetClose}
        onSave={handleSave}
        transaction={selectedTransaction}
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
              transaction.
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
