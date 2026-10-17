import { pool } from "../config/db.js";
import {
  Ticket,
  TicketFilters,
  TicketStatus,
  TicketUpdateInput,
} from "../types/ticket.js";

export async function getAllTickets(
  filters: TicketFilters = {},
  page: number = 1,
  limit: number = 10,
): Promise<{ tickets: Ticket[]; total: number }> {
  const conditions: string[] = [];
  const filterValues: (Ticket["status"] | Ticket["priority"] | string)[] = [];

  // 1.Build filters
  if (filters.status !== undefined) {
    filterValues.push(filters.status);
    conditions.push(`status = $${filterValues.length}`);
  }
  if (filters.priority !== undefined) {
    filterValues.push(filters.priority);
    conditions.push(`priority = $${filterValues.length}`);
  }
  if (filters.search !== undefined) {
    if (filters.search?.trim()) {
      filterValues.push(`%${filters.search}%`);
      conditions.push(
        `(title ILIKE $${filterValues.length} OR description ILIKE $${filterValues.length})`,
      );
    }
  }

  // Build WHERE clause
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // 3. Pagination
  const offset = (page - 1) * limit;

  const ticketValues = [...filterValues, limit, offset];

  const limitIndex = filterValues.length + 1;
  const offsetIndex = filterValues.length + 2;

  // Execute queries
  const [ticketsResult, countResult] = await Promise.all([
    pool.query<Ticket>(
      `
    SELECT *
    FROM tickets
    ${whereClause}
    ORDER BY created_at DESC, id DESC
    LIMIT $${limitIndex}
    OFFSET $${offsetIndex}
    `,
      ticketValues,
    ),

    pool.query<{ total: string }>(
      `
      SELECT COUNT(*) AS total
      FROM tickets
      ${whereClause}
      `,
      filterValues,
    ),
  ]);

  return {
    tickets: ticketsResult.rows,
    total: Number(countResult.rows[0].total),
  };
}

export async function getTicketById(id: string): Promise<Ticket | undefined> {
  const result = await pool.query<Ticket>(
    `
        SELECT * FROM tickets
        WHERE id = $1
        `,
    [id],
  );

  return result.rows[0];
}

export async function createTicket(
  userId: string,
  title: string,
  description: string,
): Promise<Ticket | undefined> {
  const result = await pool.query<Ticket>(
    `
    INSERT INTO tickets (user_id, title, description)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, description, priority, status, created_at, updated_at
    `,
    [userId, title, description],
  );

  return result.rows[0];
}

export async function updateTicket(
  id: string,
  updates: TicketUpdateInput,
): Promise<Ticket | undefined> {
  const fields = Object.entries(updates);

  if (fields.length === 0) {
    return undefined;
  }

  // Column names are fixed and trusted
  const allowedColumns = {
    title: "title",
    description: "description",
    status: "status",
    priority: "priority",
  } as const;

  const values: unknown[] = [];
  const setClauses = fields.map(([key, value], index) => {
    const column = allowedColumns[key as keyof typeof allowedColumns];

    values.push(value);

    return `${column} = $${index + 1}`;
  });

  values.push(id);
  const result = await pool.query<Ticket>(
    `
    UPDATE tickets
    SET ${setClauses.join(", ")}, updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *
    `,
    values,
  );

  return result.rows[0];
}

export async function deleteTicket(id: string): Promise<Ticket | undefined> {
  const result = await pool.query(
    `
    DELETE FROM tickets
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
}
