import express from "express";
import apiRouter from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  // ROUTES
  app.use("/api", apiRouter);

  //   app.get("/", (_req, res) => {
  //     res.status(200).json({
  //       success: true,
  //       message: "TicketFlow API is running",
  //     });
  //   });

  return app;
}
