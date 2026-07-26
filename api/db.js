import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_xc9fdAGYlFM6@ep-proud-frost-za18qfd5-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require";

let cached = null;

export function getDb() {
  if (!cached) cached = neon(DATABASE_URL);
  return cached;
}
