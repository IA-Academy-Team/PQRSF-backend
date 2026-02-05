import test from "node:test";
import assert from "node:assert/strict";
import { calculateDueDate } from "../../src/utils/date.utils";

test("calculateDueDate returns YYYY-MM-DD", () => {
  const result = calculateDueDate(5);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(result));
});

test("calculateDueDate adds days", () => {
  const today = new Date();
  const result = calculateDueDate(1);
  const parsed = new Date(result + "T00:00:00Z");
  const diffDays = Math.round((parsed.getTime() - new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).getTime()) / (1000 * 60 * 60 * 24));
  assert.ok(diffDays === 1 || diffDays === 0);
});
