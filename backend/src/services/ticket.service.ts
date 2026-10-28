import { pool } from "../config/db.js";
import type {
  Ticket,
  TicketFilters,
  TicketUpdateInput,
} from "../types/ticket.js";

type TicketResult = {
  tickets: Ticket[];
  total: number;
};

const allowedColumns = {
  title: "title",
  description: "description",
  status: "status",
  priority: "priority",
} as const;

type AllowedUpdateField = keyof typeof allowedColumns;

function isAllowedUpdateField(key: string): key is AllowedUpdateField {
  return Object.hasOwn(allowedColumns, key);
}

export async function getAllTickets(
  filters: TicketFilters = {},
  page: number = 1,
  limit: number = 10,
): Promise<TicketResult> {
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

  const search = filters.search?.trim();

  if (search) {
    filterValues.push(`%${search}%`);
    const searchIndex = filterValues.length;
    conditions.push(
      `(title ILIKE $${searchIndex} OR description ILIKE $${searchIndex})`,
    );
  }

  // Build WHERE clause
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // 3. Pagination
  const offset = (page - 1) * limit;
  const limitIndex = filterValues.length + 1;
  const offsetIndex = filterValues.length + 2;
  const ticketValues = [...filterValues, limit, offset];

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
    total: Number(countResult.rows[0].total ?? 0),
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
): Promise<Ticket> {
  const result = await pool.query<Ticket>(
    `
    INSERT INTO tickets (user_id, title, description)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, description, priority, status, created_at, updated_at
    `,
    [userId, title, description],
  );

  const ticket = result.rows[0];

  if (!ticket) {
    throw new Error("Ticket was not returned after creation");
  }
  return ticket;
}

export async function updateTicket(
  id: string,
  updates: TicketUpdateInput,
): Promise<Ticket | undefined> {
  const fields = Object.entries(updates);

  if (fields.length === 0) {
    return undefined;
  }

  // Validare all keys before building the sql statement.
  const validatedFields = fields.map(([key, value]) => {
    if (!isAllowedUpdateField(key)) {
      throw new Error(`Invalid ticket update field: ${key}`);
    }

    return { key, value };
  });

  const values: unknown[] = [];

  const setClauses = validatedFields.map(({ key, value }, index) => {
    const column = allowedColumns[key];
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
