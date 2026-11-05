import type { Request, Response } from "express";
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
} from "../services/ticket.service.js";
import {
  Ticket,
  TicketFilters,
  TicketPriority,
  TicketStatus,
  TicketUpdateInput,
} from "../types/ticket.js";
import { AppError } from "../errors/AppError.js";
import { validUuid } from "../utils/validation.js";

export async function getAllTicketController(req: Request, res: Response) {
  const pageParam = req.query.page;
  const limitParam = req.query.limit;
  const statusParam = req.query.status;
  const priorityParam = req.query.priority;
  const searchParam = req.query.search;

  const page = pageParam === undefined ? 1 : Number(pageParam);
  const limit = limitParam === undefined ? 10 : Number(limitParam);

  // Validate page
  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({
      success: false,
      message: "page must be a positive integer",
    });
  }

  // Validate limit
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: "limit must be a positive integer between 1 and 100",
    });
  }

  // Validate status
  const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];

  if (
    statusParam !== undefined &&
    (typeof statusParam !== "string" || !validStatuses.includes(statusParam))
  ) {
    return res.status(400).json({
      success: false,
      message: "status must be OPEN, IN_PROGRESS, or RESOLVED",
    });
  }

  // Validate priority
  const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  if (
    priorityParam !== undefined &&
    (typeof priorityParam !== "string" ||
      !validPriorities.includes(priorityParam))
  ) {
    return res.status(400).json({
      success: false,
      message: "priority must be LOW, MEDIUM, HIGH, or URGENT",
    });
  }

  // Validate Search
  if (
    searchParam !== undefined &&
    (typeof searchParam !== "string" || !searchParam?.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "search must be a non-empty string",
    });
  }

  // Build filters
  const filters: TicketFilters = {};

  if (statusParam !== undefined) {
    filters.status = statusParam as Ticket["status"];
  }

  if (priorityParam !== undefined) {
    filters.priority = priorityParam as Ticket["priority"];
  }
  if (searchParam !== undefined) {
    filters.search = searchParam.trim();
  }

  // Fetch tickets

  const userId = req.session.userId!;
  const result = await getAllTickets(userId, filters, page, limit);

  const totalPages = Math.ceil(result.total / limit);

  res.status(200).json({
    success: true,
    data: result.tickets,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages,
    },
  });
}

export async function getTicketControllerById(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = req.params.id;

  if (!validUuid(id)) {
    return res.status(400).json({
      success: false,
      message: "id must be a valid UUID",
    });
  }

  const userId = req.session.userId!;
  const data = await getTicketById(id, userId);

  if (!data) {
    throw new AppError(404, "ticket not found");
  }

  return res.status(200).json({
    success: true,
    data,
  });
}

export async function createTicketController(req: Request, res: Response) {
  const { title, description } = req.body;

  if (typeof title !== "string" || typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Title and description must be strings",
    });
  }

  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  if (!cleanTitle || !cleanDescription) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }

  const userId = req.session.userId!;
  const data = await createTicket(userId, cleanTitle, cleanDescription);

  return res.status(201).json({
    success: true,
    data,
  });
}

export async function updateTicketController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = req.params.id;

  if (!validUuid(id)) {
    return res.status(400).json({
      success: false,
      message: "id must be a valid UUID",
    });
  }

  const body: unknown = req.body;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      message: "Request body must be an object",
    });
  }

  const updates: TicketUpdateInput = {};
  const allowedFields = ["title", "description", "status", "priority"];

  const entries = Object.entries(body);

  // Reject empty PATCH requests

  if (entries.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required",
    });
  }

  // Reject fields that cannot be updated
  for (const [key] of entries) {
    if (!allowedFields.includes(key)) {
      return res.status(400).json({
        success: false,
        message: `Field ${key} cannot be updated`,
      });
    }
  }

  // Validate title
  if ("title" in body) {
    const title = body.title;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "title must be a non-empty string",
      });
    }

    updates.title = title.trim();
  }

  // Validate description
  if ("description" in body) {
    const description = body.description;

    if (typeof description !== "string" || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "description must be a non-empty string",
      });
    }
    updates.description = description.trim();
  }

  // Validate status
  if ("status" in body) {
    const status = body.status;

    const allowedStatuses: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status as TicketStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "invalid status",
      });
    }

    updates.status = status as TicketStatus;
  }

  // Validate priority
  if ("priority" in body) {
    const priority = body.priority;

    const allowedPriorities: TicketPriority[] = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT",
    ];

    if (
      typeof priority !== "string" ||
      !allowedPriorities.includes(priority as TicketPriority)
    ) {
      return res.status(400).json({
        success: false,
        message: "invalid priority",
      });
    }

    updates.priority = priority as TicketPriority;
  }

  const userId = req.session.userId!;
  const data = await updateTicket(id, userId, updates);

  if (!data) {
    throw new AppError(404, "ticket not found");
  }

  return res.status(200).json({
    success: true,
    data,
  });
}

export default async function deleteTicketController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = req.params.id;

  if (!validUuid(id)) {
    return res.status(400).json({
      success: false,
      message: "id must be a valid UUID",
    });
  }

  const userId = req.session.userId!;
  const data = await deleteTicket(id, userId);

  if (!data) {
    throw new AppError(404, "ticket not found");
  }

  return res.status(200).json({
    success: true,
    data,
  });
}
