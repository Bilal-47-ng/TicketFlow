import express from "express";
import apiRouter from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  // ROUTES
  app.use("/api", apiRouter);

  // MIDDLEWARE
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
}
