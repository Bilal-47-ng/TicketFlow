import { beforeEach, describe, expect, it, vi } from "vitest";
import { pool } from "../src/config/db";
import { updateTicket } from "../src/services/ticket.service.js";
import { TicketUpdateInput } from "../src/types/ticket.js";

vi.mock("../src/config/db.ts", () => ({
  pool: {
    query: vi.fn(),
  },
}));

describe("updateTicket", () => {
  it("should reject invalid fields before quering the database", async () => {
    const updates = {
      user_id: "some-value",
    } as unknown as TicketUpdateInput;

    await expect(
      updateTicket("some-ticket-id", "user-123", updates),
    ).rejects.toThrow("Invalid ticket update field: user_id");

    expect(pool.query).not.toHaveBeenCalled();
  });

  it("should update a ticket using parameterized SQL", async () => {
    const updatedTicket = {
      id: "ticket-123",
      title: "Updated title",
    };

    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [updatedTicket],
      rowCount: 1,
    } as never);

    const result = await updateTicket("ticket-123", "user-123", {
      title: "Updated title",
    });

    expect(result).toEqual(updatedTicket);

    expect(pool.query).toHaveBeenCalledOnce();

    const [query, values] = vi.mocked(pool.query).mock.calls[0];

    expect(query).toContain("UPDATE tickets");
    expect(query).toContain("title = $1");
    expect(query).toContain("WHERE id = $2 AND user_id = $3");

    expect(values).toEqual(["Updated title", "ticket-123", "user-123"]);
  });

  it("should return undefined when the ticket does not exist", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    } as never);

    const result = await updateTicket("missing-ticket-id", "user-123", {
      title: "Updated title",
    });

    expect(result).toBeUndefined();
    expect(pool.query).toHaveBeenCalledOnce();
  });
});
