import { Hono } from 'hono'
import categories  from "./categories";
import { handle } from 'hono/vercel'
import{zValidator} from '@hono/zod-validator'
import { z } from '@hono/zod-openapi'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import accounts from "./accounts";
import  transactions  from './transactions';
export const runtime = 'edge'
const  app = new Hono().basePath('/api')


  const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;