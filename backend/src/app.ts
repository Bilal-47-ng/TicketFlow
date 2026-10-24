import express from "express";
import apiRouter from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  // ROUTES
  app.use("/api", apiRouter);

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not Found",
    });
  });

  return app;
}
