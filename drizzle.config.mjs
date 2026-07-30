export default {
  dialect: "postgresql",
  schema: "./src/diagnostic/schema.js",
  out: "./drizzle",
  ...(process.env.PORTAL_DATABASE_URL
    ? { dbCredentials: { url: process.env.PORTAL_DATABASE_URL } }
    : {}),
  strict: true,
  verbose: true,
};
