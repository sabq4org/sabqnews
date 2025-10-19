import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";

let connection: any = null;
let db: any = null;

export async function getDb() {
  if (!db && process.env.DATABASE_URL) {
    try {
      connection = await mysql.createConnection(process.env.DATABASE_URL);
      db = drizzle(connection, { schema, mode: "default" });
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    }
  }
  return db;
}

// For backwards compatibility
export { db };

