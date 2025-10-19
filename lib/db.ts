import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
export const db = drizzle(connection, { schema, mode: "default" });

