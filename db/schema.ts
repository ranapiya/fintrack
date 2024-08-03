import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import{createInsertSchema} from "drizzle-zod";
import { z } from "zod";

export const accounts = pgTable("accounts",{
    id:text("id").primaryKey(),
    plaidId:text("plaidId"),
    name:text("name").notNull(),
    userId:text("user_id").notNull(),

});

export const accountsRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions), // An account can have many transactions.
  }));





export const insertAccountSchema=createInsertSchema(accounts);

export const categories = pgTable("categories",{
    id:text("id").primaryKey(),
    plaidId:text("plaidId"),
    name:text("name").notNull(),
    userId:text("user_id").notNull(),

});

export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions), // An account can have many transactions.
  }));


export const insertCategoriesSchema=createInsertSchema(categories);

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(), // Primary key column
  amount: integer("amount").notNull(), // Amount column, not null
  payee: text("payee").notNull(), // Payee column, not null
  notes: text("notes"), // Notes column, can be null
  date: timestamp("date", { mode: "date" }).notNull(), // Date column, not null
  accountId: text("account_id").references(() => accounts.id, {
    onDelete: "cascade", // Cascade delete
  }).notNull(), // Foreign key to accounts table, not null
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null", // Set to null on delete
  }), // Foreign key to categories table, can be null
});



export const transactionsRelations = relations (transactions, ({ one }) => ({
    account: one (accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
    }),
    categories: one (categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
    }),
    }));

    export const insertTransactionSchema = createInsertSchema (transactions, {
        date: z.coerce.date(),
    });


