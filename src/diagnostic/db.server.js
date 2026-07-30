import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

let cachedDatabase = null;

export function isPortalDatabaseConfigured() {
  return Boolean(process.env.PORTAL_DATABASE_URL);
}

export function getPortalDatabase() {
  if (cachedDatabase) return cachedDatabase;
  const connectionString = process.env.PORTAL_DATABASE_URL;
  if (!connectionString) {
    throw new Error("PORTAL_DATABASE_URL is required");
  }
  const client = neon(connectionString, {
    fetchOptions: {
      cache: "no-store",
    },
  });
  cachedDatabase = drizzle(client, { schema });
  return cachedDatabase;
}
