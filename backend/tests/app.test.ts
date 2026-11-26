import request from "supertest";
import { createApp } from "../src/app.ts";
import { describe, it, expect, vi } from "vitest";
import { requireAuth } from "../src/middlewares/auth.middleware.ts";

vi.mock("../src/middlewares/auth.middleware.ts", () => ({
  requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

const app = createApp();

async function createAuthenticatedAgent() {
  const agent = request.agent(app);

  await agent.post("/api/auth/register").send({
    email: "test@example.com",
    password: "Password123!",
  });

  await agent.post("/api/auth/login").send({
    email: "test@example.com",
    password: "Password123!",
  });

  return agent;
}

describe("Express App", () => {
  it("Should return 404 for an unknown route", async () => {
    const response = await request(app).get("/notFound");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Route not found",
    });
  });

  it("Should return 400 when the ticket ID is not a valid UUID", async () => {
    const response = await request(app).get("/api/tickets/not-a-uuid");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "id must be a valid UUID",
    });
  });

  it("Should return 400 when page is less than 1", async () => {
    const response = await request(app).get("/api/tickets?page=0");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "page must be a positive integer",
    });
  });

  it("Should return 400 when limit is greater than 100", async () => {
    const response = await request(app).get("/api/tickets?limit=101");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "limit must be a positive integer between 1 and 100",
    });
  });

  it("status must be OPEN, IN_PROGRESS or RESOLVED", async () => {
    const response = await request(app).get("/api/tickets?status=INVALID");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "status must be OPEN, IN_PROGRESS, or RESOLVED",
    });
  });
});
