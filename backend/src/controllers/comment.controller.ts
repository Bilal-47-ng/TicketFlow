import { Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import {
  createComment,
  deleteComment,
  getCommentsByTicketId,
  updateComment,
} from "../services/comment.service.js";
import { validUuid } from "../utils/validation.js";
import { getTicketById } from "../services/ticket.service.js";

export async function createCommentController(req: Request, res: Response) {
  const ticketId = req.params.ticketId;
  const body = req.body.body;

  if (typeof ticketId !== "string" || !validUuid(ticketId)) {
    throw new AppError(400, "Invalid ticketId");
  }
  if (typeof body !== "string" || !body.trim()) {
    throw new AppError(400, "Comment body is required");
  }

  const userId = req.session.userId;
  if (!userId) {
    throw new AppError(401, "Not authenticated");
  }

  const result = await createComment(ticketId, userId, body.trim());

  if (!result) {
    throw new AppError(404, "ticket not found");
  }

  res.status(201).json({
    success: true,
    data: result,
  });
}

export async function getCommentController(req: Request, res: Response) {
  const ticketId = req.params.ticketId;

  if (typeof ticketId !== "string" || !validUuid(ticketId)) {
    throw new AppError(400, "Invalid ticketId");
  }

  const userId = req.session.userId;
  if (!userId) {
    throw new AppError(401, "Not authenticated");
  }

  const ticketData = await getTicketById(ticketId, userId);
  if (!ticketData) {
    throw new AppError(404, "ticket not found");
  }

  const data = await getCommentsByTicketId(ticketId, userId);

  res.status(200).json({
    success: true,
    data,
  });
}

export async function deleteCommentController(req: Request, res: Response) {
  const commentId = req.params.commentId;

  if (typeof commentId !== "string" || !validUuid(commentId)) {
    throw new AppError(400, "Invalid commentId");
  }

  const userId = req.session.userId;
  if (!userId) {
    throw new AppError(401, "Not authenticated");
  }

  const result = await deleteComment(commentId, userId);

  if (!result) {
    throw new AppError(404, "Comment not found");
  }
  res.status(200).json({
    success: true,
    data: result,
  });
}

export async function updateCommentController(req: Request, res: Response) {
  const commentId = req.params.commentId;
  const body = req.body.body;

  if (typeof commentId !== "string" || !validUuid(commentId)) {
    throw new AppError(400, "Invalid commentId");
  }

  if (typeof body !== "string" || !body.trim()) {
    throw new AppError(400, "body is required");
  }

  const userId = req.session.userId;
  if (!userId) {
    throw new AppError(401, "Not authenticated");
  }

  const data = await updateComment(commentId, userId, body.trim());

  if (!data) {
    throw new AppError(404, "Comment not found");
  }

  res.status(200).json({
    success: true,
    data,
  });
}
