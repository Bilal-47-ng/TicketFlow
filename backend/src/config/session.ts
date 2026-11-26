import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db.js";
import { env } from "./env.js";

const postgresStore = connectPgSimple(session);

const sessionStore = new postgresStore({
  pool,
  tableName: "user_sessions",
  createTableIfMissing: true,
});

export const sessionMiddleware = session({
  store: sessionStore,
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  name: "ticketflow.sid",
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
});
