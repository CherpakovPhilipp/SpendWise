
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
  Entertainment: UtensilsCrossed,
  "Personal Care": HeartPulse,
  Education: Landmark,
};

export type Transaction = {
  id: string;
  name: string;
  category: string;
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
