// Nyx Database Connection Helper
// Uses Neon serverless Postgres via Vercel environment variable
// NEVER hardcode credentials — DATABASE_URL set via Vercel dashboard

import { neon } from "@neondatabase/serverless";

let cached = null;

export function getDb() {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    cached = neon(url);
  }
  return cached;
}
