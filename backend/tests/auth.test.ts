import { describe, it, expect } from "vitest";
import { createApp } from "../src/app";
import request from "supertest";
const app = createApp();

describe("Ticket routes Authentication", () => {
  it("should return 401 when an unauthenticated user accesses tickets", async () => {
    const response = await request(app).get("/api/tickets");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: "Not authenticated",
    });
  });

  it("should return 401 when an unauthentincated user accesses ticket statistics", async () => {
    const response = await request(app).get("/api/tickets/statistics");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: "Not authenticated",
    });
  });
});
