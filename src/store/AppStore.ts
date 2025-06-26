
'use client';

import { makeAutoObservable, runInAction } from "mobx";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import {
  fetchTransactions,
  saveTransaction as saveTransactionAction,
  deleteTransaction as deleteTransactionAction,
  fetchBudgets,
  saveBudget as saveBudgetAction,
  deleteBudget as deleteBudgetAction,
} from "@/lib/actions";
import type { Transaction, Budget } from "@/lib/definitions";
import { transactions as mockTransactions, budgets as mockBudgets } from "@/data/mock";

export class AppStore {
  transactions: Transaction[] = [];
  budgets: Budget[] = [];
  loading = true;
  mode: "online" | "offline" = "offline";

  constructor() {
    makeAutoObservable(this);
    // Do not initialize from localStorage here to prevent hydration mismatch.
    // The mode is set from the AppProvider after the component mounts.
  }

  setMode = (mode: "online" | "offline") => {
    this.mode = mode;
    if (typeof window !== "undefined") {
      localStorage.setItem("mode", mode);
    }
    this.loadData();
  }

  recalculateAllBudgetsSpent() {
    this.budgets.forEach(budget => {
      const totalSpent = this.transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((acc, t) => acc + t.amount, 0);
      budget.spent = totalSpent;
    });
  }

  async loadData() {
    this.loading = true;
    try {
      if (this.mode === 'online') {
        const [txs, bgs] = await Promise.all([fetchTransactions(), fetchBudgets()]);
        runInAction(() => {
          this.transactions = txs.map((t: any) => ({
            ...t,
            amount: Number(t.amount),
            date: format(new Date(t.date), "yyyy-MM-dd"),
          }));
          this.budgets = bgs.map((b: any) => ({ ...b, goal: Number(b.goal), spent: Number(b.spent) }));
        });
      } else {
        const localTxs = JSON.parse(localStorage.getItem('transactions') || 'null') || mockTransactions;
        const localBudgets = JSON.parse(localStorage.getItem('budgets') || 'null') || mockBudgets;
        runInAction(() => {
          this.transactions = localTxs;
          this.budgets = localBudgets;
        });
      }
      this.recalculateAllBudgetsSpent();
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async saveTransaction(transaction: Transaction | Omit<Transaction, "id">) {
    this.loading = true;
    try {
      if (this.mode === 'online') {
        await saveTransactionAction(transaction);
      } else {
        let updatedTxs;
        if ('id' in transaction && transaction.id) {
          updatedTxs = this.transactions.map(t => t.id === transaction.id ? transaction as Transaction : t);
        } else {
          const newTx = { ...transaction, id: `txn_${Date.now()}` };
          updatedTxs = [newTx, ...this.transactions];
        }
        this.transactions = updatedTxs;
        localStorage.setItem('transactions', JSON.stringify(updatedTxs));
      }
    } catch (error) {
      console.error("Failed to save transaction", error);
    } finally {
      await this.loadData();
    }
  }

  async deleteTransaction(id: string) {
    this.loading = true;
    try {
      if (this.mode === 'online') {
        await deleteTransactionAction(id);
      } else {
        const updatedTxs = this.transactions.filter(t => t.id !== id);
        this.transactions = updatedTxs;
        localStorage.setItem('transactions', JSON.stringify(updatedTxs));
      }
    } catch (error) {
      console.error("Failed to delete transaction", error);
    } finally {
      await this.loadData();
    }
  }

  async saveBudget(budget: Budget | Omit<Budget, "id" | "spent">) {
    this.loading = true;
    try {
      // The `spent` property is calculated, so initialize to 0 for saving.
      // The store's `spent` value will be updated by `recalculateAllBudgetsSpent` after `loadData`.
      const budgetToSave = { ...budget, spent: 'spent' in budget ? budget.spent : 0 };

      if (this.mode === 'online') {
        await saveBudgetAction(budgetToSave);
      } else {
        let updatedBudgets;
        if ('id' in budgetToSave && budgetToSave.id) {
            updatedBudgets = this.budgets.map(b => b.id === budgetToSave.id ? budgetToSave as Budget : b);
        } else {
            const newBudget = { ...budgetToSave, id: `bud_${Date.now()}` };
            updatedBudgets = [newBudget, ...this.budgets];
        }
        this.budgets = updatedBudgets;
        localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
      }
    } catch (error) {
      console.error("Failed to save budget", error);
    } finally {
      await this.loadData();
    }
  }

  async deleteBudget(id: string) {
    this.loading = true;
    try {
      if (this.mode === 'online') {
        await deleteBudgetAction(id);
      } else {
        const updatedBudgets = this.budgets.filter(b => b.id !== id);
        this.budgets = updatedBudgets;
        localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
      }
    } catch (error) {
      console.error("Failed to delete budget", error);
    } finally {
      await this.loadData();
    }
  }

  get totalIncome() {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }

  get totalExpenses() {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }

  get totalBalance() {
    return this.totalIncome - this.totalExpenses;
  }
  
  getSpendingForMonth(month: string) {
    const targetDate = new Date(month);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);

    const monthlyExpenses = this.transactions.filter(t => {
      const tDate = parseISO(t.date);
      return t.type === 'expense' && isWithinInterval(tDate, { start: monthStart, end: monthEnd });
    });

    const spendingByCategory = monthlyExpenses.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(spendingByCategory).map(([category, amount]) => ({
      category,
      amount,
    }));
  }

  get availableBudgetCategories() {
    const budgetCategories = new Set(this.budgets.map(b => b.category));
    const transactionCategories = new Set(this.transactions.map(t => t.category));
    return [...transactionCategories].filter(c => !budgetCategories.has(c) && c !== 'Income');
  }
}
