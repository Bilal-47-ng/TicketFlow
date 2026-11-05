import { describe, it, expect } from "vitest";
import { getTotalPages } from "../src/utils/pagination";

describe("getTotalPages", () => {
  it("returns 2 pages for 20 tickets with 10 per page", () => {
    expect(getTotalPages(20, 10)).toBe(2);
  });

  it("returns 0 pages for 0 tickets with 10 per page", () => {
    expect(getTotalPages(0, 10)).toBe(0);
  });

  it("returns 3 pages for 21 tickets with 10 per page", () => {
    expect(getTotalPages(21, 10)).toBe(3);
  });

  it("throws an error when limit is 0", () => {
    expect(() => getTotalPages(20, 0)).toThrow(
      "total and limit must be an integer number greater than 0",
    );
  });

  it("throws an error when limit is negative", () => {
    expect(() => getTotalPages(20, -5)).toThrow(
      "total and limit must be an integer number greater than 0",
    );
  });

  it("throws an error when total is negative", () => {
    expect(() => getTotalPages(-10, 10)).toThrow(
      "total and limit must be an integer number greater than 0",
    );
  });

  it("throws an error when total is not an integer number", () => {
    expect(() => getTotalPages(20, 2.5)).toThrow(
      "total and limit must be an integer number greater than 0",
    );
  });
  it("throws an error when limit is not an integer number", () => {
    expect(() => getTotalPages(2.5, 20)).toThrow(
      "total and limit must be an integer number greater than 0",
    );
  });
});
