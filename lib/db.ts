import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";

let db: any = null;

export function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
      throw new Error("DATABASE_URL or POSTGRES_URL environment variable is not set");
    }
    try {
      const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
      const client = postgres(connectionString!);
      db = drizzle(client, { schema });
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    }
  }
  return db;
}

// For backwards compatibility
export { db };

