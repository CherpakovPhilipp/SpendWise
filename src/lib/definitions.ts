
import {
    ShoppingCart,
    UtensilsCrossed,
    Car,
    Home,
    HeartPulse,
    Receipt,
    Landmark,
    Target,
} from "lucide-react";

export const categoryIcons = {
  Groceries: ShoppingCart,
  Dining: UtensilsCrossed,
  Transport: Car,
  Housing: Home,
  Health: HeartPulse,
  Shopping: Target,
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

export type Budget = {
  id: string;
  category: string;
  spent: number;
  goal: number;
};
