
'use server';

import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Transaction, Budget } from './definitions';
import { z } from 'zod';

const TransactionSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required."),
  date: z.string(),
});

const CreateTransaction = TransactionSchema.omit({ id: true });
const UpdateTransaction = TransactionSchema;

const BudgetSchema = z.object({
  id: z.string(),
  category: z.string().min(2, "Category must be at least 2 characters."),
  goal: z.coerce.number().positive("Goal must be a positive number."),
  spent: z.coerce.number().min(0, "Spent must be a non-negative number."),
});

const CreateBudget = BudgetSchema.omit({ id: true });
const UpdateBudget = BudgetSchema;


// Transactions
export async function fetchTransactions() {
  noStore();
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        type VARCHAR(50) NOT NULL
      );`;
    const data = await sql<Transaction>`SELECT * FROM transactions ORDER BY date DESC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transactions.');
  }
}

export async function saveTransaction(data: Omit<Transaction, "id"> | Transaction) {
    const isUpdate = 'id' in data && data.id;

    if (isUpdate) {
        const validatedFields = UpdateTransaction.safeParse(data);
        if (!validatedFields.success) {
            throw new Error('Invalid transaction data for update.');
        }
        const { id, name, category, date, amount, type } = validatedFields.data;
        await sql`
            UPDATE transactions
            SET name = ${name}, category = ${category}, date = ${date}, amount = ${amount}, type = ${type}
            WHERE id = ${id}
        `;
        return validatedFields.data;
    } else {
        const validatedFields = CreateTransaction.safeParse(data);
        if (!validatedFields.success) {
            throw new Error('Invalid transaction data for creation.');
        }
        const { name, category, date, amount, type } = validatedFields.data;
        const id = `txn_${Date.now()}`;
        await sql`
            INSERT INTO transactions (id, name, category, date, amount, type)
            VALUES (${id}, ${name}, ${category}, ${date}, ${amount}, ${type})
        `;
        return { ...validatedFields.data, id };
    }
}

export async function deleteTransaction(id: string) {
    try {
        await sql`DELETE FROM transactions WHERE id = ${id}`;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete transaction.');
    }
}


// Budgets
export async function fetchBudgets() {
  noStore();
  try {
    await sql`CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        category VARCHAR(255) NOT NULL UNIQUE,
        spent NUMERIC(10, 2) NOT NULL,
        goal NUMERIC(10, 2) NOT NULL
      );`;
    const data = await sql<Budget>`SELECT * FROM budgets ORDER BY category ASC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch budgets.');
  }
}

export async function saveBudget(data: Omit<Budget, "id"> | Budget) {
    const isUpdate = 'id' in data && data.id;

    if (isUpdate) {
        const validatedFields = UpdateBudget.safeParse(data);
        if (!validatedFields.success) {
            throw new Error('Invalid budget data for update.');
        }
        const { id, category, goal, spent } = validatedFields.data;
        await sql`
            UPDATE budgets
            SET category = ${category}, goal = ${goal}, spent = ${spent}
            WHERE id = ${id}
        `;
        return validatedFields.data;
    } else {
        const validatedFields = CreateBudget.safeParse(data);
        if (!validatedFields.success) {
            throw new Error('Invalid budget data for creation.');
        }
        const { category, goal, spent } = validatedFields.data;
        const id = `bud_${Date.now()}`;
        await sql`
            INSERT INTO budgets (id, category, spent, goal)
            VALUES (${id}, ${category}, ${spent}, ${goal})
        `;
        return { ...validatedFields.data, id };
    }
}

export async function deleteBudget(id: string) {
    try {
        await sql`DELETE FROM budgets WHERE id = ${id}`;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete budget.');
    }
}
