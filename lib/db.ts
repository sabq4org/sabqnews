import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";

let db: any = null;

export async function getDb() {
  if (!db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
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

