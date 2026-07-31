import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

let cachedDatabase = null;
let cachedSqlClient = null;

export function isPortalDatabaseConfigured() {
  return Boolean(process.env.PORTAL_DATABASE_URL);
}

export function getPortalDatabase() {
  if (cachedDatabase) return cachedDatabase;
  const client = getPortalSqlClient();
  cachedDatabase = drizzle(client, { schema });
  return cachedDatabase;
}

export function getPortalSqlClient() {
  if (cachedSqlClient) return cachedSqlClient;
  const connectionString = process.env.PORTAL_DATABASE_URL;
  if (!connectionString) {
    throw new Error("PORTAL_DATABASE_URL is required");
  }
  cachedSqlClient = neon(connectionString, {
    fetchOptions: {
      cache: "no-store",
    },
  });
  return cachedSqlClient;
}
