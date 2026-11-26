import { Router } from "express";
import deleteTicketController, {
  createTicketController,
  getAllTicketController,
  getTicketControllerById,
  updateTicketController,
} from "../controllers/ticket.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createCommentController,
  getCommentController,
  deleteCommentController,
  updateCommentController,
} from "../controllers/comment.controller.js";

const ticketRouter = Router();

ticketRouter.use(requireAuth);

ticketRouter.get("/", getAllTicketController);
ticketRouter.get("/:id", getTicketControllerById);
ticketRouter.post("/", createTicketController);
ticketRouter.patch("/:id", updateTicketController);
ticketRouter.delete("/:id", deleteTicketController);

ticketRouter.post("/:ticketId/comments", createCommentController);
ticketRouter.get("/:ticketId/comments", getCommentController);
ticketRouter.delete("/comments/:commentId", deleteCommentController);
ticketRouter.patch("/comments/:commentId", updateCommentController);

export default ticketRouter;
