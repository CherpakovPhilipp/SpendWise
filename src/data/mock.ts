import {
  ShoppingCart,
  UtensilsCrossed,
  Car,
  Home,
  HeartPulse,
  Receipt,
  Landmark,
} from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

export const categoryIcons = {
  Groceries: ShoppingCart,
  Dining: UtensilsCrossed,
  Transport: Car,
  Housing: Home,
  Health: HeartPulse,
  Other: Receipt,
  Income: Landmark,
};

export type Transaction = {
  id: string;
  name: string;
  category: keyof typeof categoryIcons;
  date: string;
  amount: number;
  type: "expense" | "income";
};

export const transactions: Transaction[] = [
  {
    id: "txn1",
    name: "Grocery Store",
    category: "Groceries",
    date: "2024-07-28",
    amount: 75.6,
    type: "expense",
  },
  {
    id: "txn2",
    name: "Salary",
    category: "Income",
    date: "2024-07-28",
    amount: 2500,
    type: "income",
  },
  {
    id: "txn3",
    name: "Gas Station",
    category: "Transport",
    date: "2024-07-27",
    amount: 40.0,
    type: "expense",
  },
  {
    id: "txn4",
    name: "Restaurant",
    category: "Dining",
    date: "2024-07-26",
    amount: 55.2,
    type: "expense",
  },
  {
    id: "txn5",
    name: "Rent",
    category: "Housing",
    date: "2024-07-25",
    amount: 1200.0,
    type: "expense",
  },
  {
    id: "txn6",
    name: "Pharmacy",
    category: "Health",
    date: "2024-07-24",
    amount: 25.0,
    type: "expense",
  },
  {
    id: "txn7",
    name: "Freelance Project",
    category: "Income",
    date: "2024-07-23",
    amount: 500,
    type: "income",
  },
];

export const budgetGoals = [
  { category: "Dining", spent: 350.75, goal: 500 },
  { category: "Groceries", spent: 210.5, goal: 400 },
  { category: "Transport", spent: 95.0, goal: 150 },
  { category: "Shopping", spent: 450.0, goal: 300 },
];

export const chartData = [
  { category: "Groceries", amount: 450 },
  { category: "Dining", amount: 350 },
  { category: "Transport", amount: 200 },
  { category: "Housing", amount: 1200 },
  { category: "Health", amount: 150 },
  { category: "Other", amount: 300 },
];

export const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--primary))",
  },
  Groceries: { label: "Groceries", color: "hsl(var(--chart-1))" },
  Dining: { label: "Dining", color: "hsl(var(--chart-2))" },
  Transport: { label: "Transport", color: "hsl(var(--chart-3))" },
  Housing: { label: "Housing", color: "hsl(var(--chart-4))" },
  Health: { label: "Health", color: "hsl(var(--chart-5))" },
  Other: { label: "Other", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;
