
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
import { Transaction } from "@/lib/definitions";
import { useApp } from "@/context/AppProvider";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsPage() {
  const { transactions, saveTransaction, deleteTransaction, loading } = useApp();
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

  const confirmDelete = async () => {
    if (selectedTransaction) {
      await deleteTransaction(selectedTransaction.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleSave = async (data: Transaction | Omit<Transaction, "id">) => {
    await saveTransaction(data);
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
