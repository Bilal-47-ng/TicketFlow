import type { Request, Response, NextFunction } from "express";
import { describe, it, expect, vi } from "vitest";
import { requireAuth } from "../src/middlewares/auth.middleware";

describe("requireAuth Middleware", () => {
  it("should throw 401 when user is not authenticated", () => {
    const req = {
      session: {},
    } as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    expect(() => requireAuth(req, res, next)).toThrow("Not authenticated");

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when user is authenticated", () => {
    const req = {
      session: {
        userId: "user-123",
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
