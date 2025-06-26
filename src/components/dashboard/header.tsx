
"use client";

import { Download, PlusCircle, Upload } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as xlsx from "xlsx";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Transaction } from "@/data/mock";

type HeaderProps = {
  onAdd: () => void;
  transactions: Transaction[];
};

export function Header({ onAdd, transactions }: HeaderProps) {
  const exportAs = (format: "csv" | "xlsx" | "pdf") => {
    const data = transactions.map((t) => ({
      ID: t.id,
      Name: t.name,
      Category: t.category,
      Date: t.date,
      Amount: t.amount,
      Type: t.type,
    }));

    if (format === "csv") {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((header) => (row as any)[header]).join(",")
        ),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === "xlsx") {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions");
      xlsx.writeFile(workbook, "transactions.xlsx");
    } else if (format === "pdf") {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [["ID", "Name", "Category", "Date", "Amount", "Type"]],
        body: data.map((t) => [
          t.ID,
          t.Name,
          t.Category,
          t.Date,
          `$${t.Amount.toFixed(2)}`,
          t.Type,
        ]),
      });
      doc.save("transactions.pdf");
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your financial activity.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportAs("csv")}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAs("xlsx")}>
              Export as XLSX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportAs("pdf")}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage
                  src="https://placehold.co/40x40"
                  alt="User Avatar"
                  data-ai-hint="person avatar"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
