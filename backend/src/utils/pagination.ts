export function getTotalPages(total: number, limit: number): number {
  if (
    total < 0 ||
    limit <= 0 ||
    !Number.isInteger(total) ||
    !Number.isInteger(limit)
  ) {
    throw new Error("total and limit must be an integer number greater than 0");
  }

  return Math.ceil(total / limit);
}
