import { Router } from "express";
import deleteTicketController, {
  createTicketController,
  getAllTicketController,
  getTicketControllerById,
  updateTicketController,
} from "../controllers/ticket.controller.js";

const ticketRouter = Router();

ticketRouter.get("/", getAllTicketController);
ticketRouter.get("/:id", getTicketControllerById);
ticketRouter.post("/", createTicketController);
ticketRouter.patch("/:id", updateTicketController);
ticketRouter.delete("/:id", deleteTicketController);

export default ticketRouter;
