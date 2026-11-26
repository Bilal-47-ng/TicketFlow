import { Router, Request, Response } from "express";
import ticketRouter from "./ticket.routes.js";
import authRouter from "./auth.routes.js";

const apiRouter = Router();

apiRouter.use("/tickets", ticketRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;
