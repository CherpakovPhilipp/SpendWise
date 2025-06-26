"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { transactions as mockTransactions, categoryIcons, Transaction } from "@/data/mock";
import { EditTransactionSheet } from "./edit-transaction-sheet";

export function TransactionsTable() {
  const [transactions, setTransactions] = React.useState(mockTransactions);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);

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
      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };
  
  const handleSave = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map((t) => t.id === updatedTransaction.id ? updatedTransaction : t));
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleSheetClose = () => {
    setIsEditDialogOpen(false);
    setSelectedTransaction(null);
  }

  return (
    <>
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const Icon = categoryIcons[transaction.category] || categoryIcons.Other;
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {transaction.type === "expense" ? "Payment" : "Deposit"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="flex items-center justify-center gap-2">
                       <Icon className="h-4 w-4" />
                       {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {transaction.date}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "income" ? "text-green-600" : ""
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(transaction)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDelete(transaction)} className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <EditTransactionSheet 
        isOpen={isEditDialogOpen}
        onClose={handleSheetClose}
        onSave={handleSave}
        transaction={selectedTransaction}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this transaction.
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
