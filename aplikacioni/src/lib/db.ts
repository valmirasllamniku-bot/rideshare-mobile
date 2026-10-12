
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Mungon DATABASE_URL te .env.local");
}

const globalForDb = globalThis as unknown as {
  pool?: Pool;
};

export const db =
  globalForDb.pool ??
  new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = db;
}
