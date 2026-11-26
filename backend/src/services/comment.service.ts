import { pool } from "../config/db.js";
import { TicketComment } from "../types/comment.js";

export async function createComment(
  ticketId: string,
  userId: string,
  body: string,
): Promise<TicketComment | undefined> {
  const result = await pool.query<TicketComment>(
    `
    INSERT INTO ticket_comments (user_id, ticket_id, body)
    SELECT $1, $2, $3
    WHERE EXISTS (
        SELECT 1
        FROM tickets
        WHERE id = $2 AND user_id = $1
    )
    returning *
    `,
    [userId, ticketId, body],
  );

  return result.rows[0];
}

export async function getCommentsByTicketId(
  ticketId: string,
  userId: string,
): Promise<TicketComment[]> {
  const result = await pool.query<TicketComment>(
    `
    SELECT *
    FROM ticket_comments
    WHERE ticket_id = $1
    AND EXISTS (
        SELECT 1
        FROM tickets
        WHERE id = $1 AND user_id = $2
    )
    ORDER BY created_at ASC
    `,
    [ticketId, userId],
  );

  return result.rows;
}

export async function deleteComment(
  commentId: string,
  userId: string,
): Promise<TicketComment | undefined> {
  const result = await pool.query<TicketComment>(
    `
    DELETE FROM ticket_comments
    WHERE id = $1 AND user_id = $2
    RETURNING *
    `,
    [commentId, userId],
  );

  return result.rows[0];
}

export async function updateComment(
  commentId: string,
  userId: string,
  body: string,
): Promise<TicketComment | undefined> {
  const result = await pool.query<TicketComment>(
    `
    UPDATE ticket_comments
    SET body = $1
    WHERE id = $2 AND user_id = $3
    RETURNING *
    `,
    [body, commentId, userId],
  );

  return result.rows[0];
}
