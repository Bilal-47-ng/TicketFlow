import request from "supertest";
import { describe, it, expect } from "vitest";
import express from "express";
import { AppError } from "../src/errors/AppError";
import { errorMiddleware } from "../src/middlewares/error.middleware";

const app = express();
app.use(express.json());

app.get("/app-error", async (_req, _res) => {
  throw new AppError(404, "Ticket not found");
});
app.get("/unexpected-error", async (_req, _res) => {
  throw new Error("Database connection failed");
});

app.use(errorMiddleware);

describe("Error Middleware", () => {
  it("should handle AppError", async () => {
    const response = await request(app).get("/app-error");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Ticket not found",
    });
  });

  it("should handle server error", async () => {
    const response = await request(app).get("/unexpected-error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Internal server error",
    });
  });
});
