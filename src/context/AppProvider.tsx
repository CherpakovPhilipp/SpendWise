
"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  fetchTransactions,
  saveTransaction as saveTransactionAction,
  deleteTransaction as deleteTransactionAction,
  fetchBudgets,
  saveBudget as saveBudgetAction,
  deleteBudget as deleteBudgetAction,
} from "@/lib/actions";
import { Transaction, Budget } from "@/lib/definitions";
import { transactions as mockTransactions, budgets as mockBudgets } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";

type AppContextType = {
  mode: "online" | "offline";
  setMode: (mode: "online" | "offline") => void;
  transactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  saveTransaction: (transaction: Transaction | Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  saveBudget: (budget: Budget | Omit<Budget, "id">) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
};

const AppContext = React.createContext<AppContextType | null>(null);

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<"online" | "offline">("offline");
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const storedMode = (localStorage.getItem("mode") as "online" | "offline") || "offline";
    setMode(storedMode);
  }, []);

  const setMode = (newMode: "online" | "offline") => {
    localStorage.setItem("mode", newMode);
    setModeState(newMode);
  };

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      if (mode === 'online') {
        const [txs, bgs] = await Promise.all([fetchTransactions(), fetchBudgets()]);
        
        const parsedTxs = txs.map((t: any) => ({
          ...t,
          amount: Number(t.amount),
          date: format(new Date(t.date), 'yyyy-MM-dd'),
        }));
        
        const parsedBgs = bgs.map((b: any) => ({
          ...b,
          spent: Number(b.spent),
          goal: Number(b.goal),
        }));

        setTransactions(parsedTxs);
        setBudgets(parsedBgs);
      } else {
        const localTxs = JSON.parse(localStorage.getItem('transactions') || 'null') || mockTransactions;
        const localBudgets = JSON.parse(localStorage.getItem('budgets') || 'null') || mockBudgets;
        setTransactions(localTxs);
        setBudgets(localBudgets);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to load data", description: (error as Error).message });
    } finally {
      setLoading(false);
    }
  }, [mode, toast]);

  React.useEffect(() => {
    loadData();
  }, [mode, loadData]);

  const saveTransaction = async (transaction: Transaction | Omit<Transaction, "id">) => {
    setLoading(true);
    try {
      if (mode === 'online') {
        await saveTransactionAction(transaction);
      } else {
        let updatedTxs;
        if ('id' in transaction && transaction.id) {
          updatedTxs = transactions.map(t => t.id === transaction.id ? transaction as Transaction : t);
        } else {
          const newTx = { ...transaction, id: `txn${Date.now()}` };
          updatedTxs = [newTx, ...transactions];
        }
        setTransactions(updatedTxs);
        localStorage.setItem('transactions', JSON.stringify(updatedTxs));
      }
      await loadData();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to save transaction", description: (error as Error).message });
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    try {
      if (mode === 'online') {
        await deleteTransactionAction(id);
      } else {
        const updatedTxs = transactions.filter(t => t.id !== id);
        setTransactions(updatedTxs);
        localStorage.setItem('transactions', JSON.stringify(updatedTxs));
      }
      await loadData();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete transaction", description: (error as Error).message });
      setLoading(false);
    }
  };

  const saveBudget = async (budget: Budget | Omit<Budget, "id">) => {
    setLoading(true);
    try {
      if (mode === 'online') {
        await saveBudgetAction(budget);
      } else {
        let updatedBudgets;
        if ('id' in budget && budget.id) {
            updatedBudgets = budgets.map(b => b.id === budget.id ? budget as Budget : b);
        } else {
            const newBudget = { ...budget, id: `bud${Date.now()}`, spent: 'spent' in budget ? budget.spent : 0 };
            updatedBudgets = [newBudget, ...budgets];
        }
        setBudgets(updatedBudgets);
        localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
      }
      await loadData();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to save budget", description: (error as Error).message });
      setLoading(false);
    }
  };

  const deleteBudget = async (id: string) => {
    setLoading(true);
    try {
      if (mode === 'online') {
        await deleteBudgetAction(id);
      } else {
        const updatedBudgets = budgets.filter(b => b.id !== id);
        setBudgets(updatedBudgets);
        localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
      }
      await loadData();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete budget", description: (error as Error).message });
      setLoading(false);
    }
  };


  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        transactions,
        budgets,
        loading,
        saveTransaction,
        deleteTransaction,
        saveBudget,
        deleteBudget,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
