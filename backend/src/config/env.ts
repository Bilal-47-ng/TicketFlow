import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
const port = Number(process.env.PORT ?? 3005);
const sessionSecret = process.env.SESSION_SECRET;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid port number");
}

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must be at least 32 characters long");
}

export const env = {
  databaseUrl,
  port,
  sessionSecret,
};
