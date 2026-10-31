import express from "express";
import apiRouter from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { sessionMiddleware } from "./config/session.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));
  app.use(sessionMiddleware);

  // ROUTES
  app.use("/api", apiRouter);

  // MIDDLEWARE
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
}
