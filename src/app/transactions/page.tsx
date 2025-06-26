import { TransactionsTable } from "@/components/transactions/transactions-table";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  return (
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
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
        </div>
      </div>
      <TransactionsTable />
    </div>
  );
}
