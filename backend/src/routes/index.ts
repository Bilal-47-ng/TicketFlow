import { Router, Request, Response } from "express";
import ticketRouter from "./ticket.routes.js";

const apiRouter = Router();

apiRouter.use("/tickets", ticketRouter);

export default apiRouter;
