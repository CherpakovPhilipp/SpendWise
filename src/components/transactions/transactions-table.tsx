
"use client";

import * as React from "react";
import { MoreHorizontal, Calendar as CalendarIcon, ArrowUpDown } from "lucide-react";
import { format, parseISO, isWithinInterval } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { categoryIcons, Transaction } from "@/data/mock";
import { cn } from "@/lib/utils";

type TransactionsTableProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

type SortConfig = {
  key: keyof Transaction | null;
  direction: 'ascending' | 'descending';
};

export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ key: 'date', direction: 'descending' });
  const itemsPerPage = 10;

  const filteredTransactions = React.useMemo(() => {
    let filtered = [...transactions];
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(t => {
        const transactionDate = parseISO(t.date);
        return isWithinInterval(transactionDate, { start: dateRange.from!, end: dateRange.to! });
      });
    }
    return filtered;
  }, [transactions, dateRange]);

  const sortedTransactions = React.useMemo(() => {
    let sortableItems = [...filteredTransactions];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTransactions, sortConfig]);

  const requestSort = (key: keyof Transaction) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  return (
    <>
      <div className="flex items-center gap-4 py-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
         <Button variant="outline" onClick={() => setDateRange(undefined)}>
          Clear Filter
        </Button>
      </div>
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => requestSort('date')}>
                <div className="flex items-center gap-2">
                  Date <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => requestSort('amount')}>
                 <div className="flex items-center justify-end gap-2">
                  Amount <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.length > 0 ? currentTransactions.map((transaction) => {
              const Icon =
                categoryIcons[transaction.category as keyof typeof categoryIcons] || categoryIcons.Other;
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {transaction.type === "expense" ? "Payment" : "Deposit"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(parseISO(transaction.date), 'PP')}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : ""
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onSelect={() => onEdit(transaction)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => onDelete(transaction)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
}
