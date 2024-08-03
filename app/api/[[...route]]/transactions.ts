import { transactions,insertTransactionSchema, categories, accounts, insertCategoriesSchema } from "@/db/schema";
import { Hono } from "hono";
import{subDays,parse} from "date-fns";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db/drizzle";
import { clerkMiddleware,getAuth } from "@hono/clerk-auth";
import{createId} from "@paralleldrive/cuid2"
import{and, eq, gte, inArray, lte, SQL,desc, sql} from "drizzle-orm";
import { z } from "zod";
import { PgTableWithColumns, PgColumn } from "drizzle-orm/pg-core";



const app = new Hono()
.get(
    "/", 
    zValidator("query", z.object({ 
      from: z.string().optional(), 
      to: z.string().optional(), 
      accountId: z.string().optional(),
     })),


    clerkMiddleware(),
    async(c)=>{
        const auth = getAuth(c);
        const {from,to,accountId}=c.req.valid("query");
       if(!auth?.userId){
        return  c.json({error:"unauthorized"},401);   
       }
     const defaultTo=new Date();
     const defaultFrom = subDays (defaultTo,30);

     const startDate = from
? parse(from, "yyyy-MM-dd", new Date())
: defaultFrom;
const endDate = to
? parse(to, "yyyy-MM-dd", new Date())
: defaultTo;
   
const data = await db
.select({

id: transactions.id,
date:transactions.date,
category: categories.name,
categoryId: transactions.categoryId,
payee: transactions. payee,
amount: transactions. amount,
notes: transactions. notes,
account: accounts.name,
accountId: transactions.accountId,

})
.from(transactions)
  .innerJoin(accounts, eq(transactions.accountId, accounts.id))
  .leftJoin(categories, eq(transactions.categoryId, categories.id))
  .where(
    and(
      accountId ? eq(transactions.accountId, accountId) : undefined, 
      eq(accounts.userId, auth.userId),  
      gte(transactions.date, startDate), // Filter transactions from the start date
      lte(transactions.date, endDate) // Filter transactions until the end date
    )
  )
  .orderBy(desc(transactions.date)); // Order transactions by date in descending order

return c.json({ data });




  
}).get(
  "/:id",
  zValidator("param", z.object({
    id: z.string().optional(),
  })),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }
    
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db
      .select({
        id: transactions.id,
date:transactions.date,
categoryId: transactions.categoryId,
payee: transactions. payee,
amount: transactions. amount,
notes: transactions. notes,
accountId: transactions.accountId,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))

      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(transactions.id, id)
        )
      );

    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data });
  }
)


.post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({
      id: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
  
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
  
      const [data] = await db.insert(transactions).values({
        id: createId(),
        ...values,
      }).returning();
  
      return c.json({data});
    }
  )


.post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
  
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
        
      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db.select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids), // Check if transaction ID is in the given values
              eq(accounts.userId, auth.userId) // Ensure transactions belong to the authenticated user
            )
          )
      );
      
      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`select id from ${transactionsToDelete}`) // Delete transactions based on the CTE
        )
        .returning({ id: transactions.id });
  
      return c.json({data});
    }
  )

  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        })
      )
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
  
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
  
        const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          }))
        ).returning();
  
        return c.json({ data });
    
    },

 )
  
.patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");
  
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
  
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db.select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              eq(transactions.id,id), // Check if transaction ID is in the given values
              eq(accounts.userId, auth.userId) // Ensure transactions belong to the authenticated user
            )
          )
      );
      
  
      const data = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(transactions.id, sql`select id from ${transactionsToUpdate}`) // update transactions based on the CTE
        )
        .returning({ id: transactions.id });
        
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
  
      return c.json({ data });
    }
  )


.delete(
  "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    
    
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
  
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
  
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db.select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              eq(transactions.id,id), // Check if transaction ID is in the given values
              eq(accounts.userId, auth.userId) // Ensure transactions belong to the authenticated user
            )
          )
      );
  
      const [data] = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`select id from ${transactionsToDelete}`) // update transactions based on the CTE
      )
      .returning({ id: transactions.id });
  
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }
  
      return c.json({ data });
    }
  );

  

export default app;

function leftJoin(categories: PgTableWithColumns<{ name: "categories"; schema: undefined; columns: { id: PgColumn<{ name: "id"; tableName: "categories"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: true; hasDefault: false; isPrimaryKey: true; isAutoincrement: false; hasRuntimeDefault: false; enumValues: [string, ...string[]]; baseColumn: never; generated: undefined; }, {}, {}>; plaidId: PgColumn<{ name: "plaidId"; tableName: "categories"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: false; hasDefault: false; isPrimaryKey: false; isAutoincrement: false; hasRuntimeDefault: false; enumValues: [string, ...string[]]; baseColumn: never; generated: undefined; }, {}, {}>; name: PgColumn<{ name: "name"; tableName: "categories"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: true; hasDefault: false; isPrimaryKey: false; isAutoincrement: false; hasRuntimeDefault: false; enumValues: [string, ...string[]]; baseColumn: never; generated: undefined; }, {}, {}>; userId: PgColumn<{ name: "user_id"; tableName: "categories"; dataType: "string"; columnType: "PgText"; data: string; driverParam: string; notNull: true; hasDefault: false; isPrimaryKey: false; isAutoincrement: false; hasRuntimeDefault: false; enumValues: [string, ...string[]]; baseColumn: never; generated: undefined; }, {}, {}>; }; dialect: "pg"; }>, arg1: SQL<unknown>) {
  throw new Error("Function not implemented.");
}
function where() {
  throw new Error("Function not implemented.");
}

