import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import ticketRouter from "../modules/tickets/ticket.routes.js";

const apiRouter = Router();

apiRouter.use("/tickets", ticketRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;
