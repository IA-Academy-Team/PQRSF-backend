import test from "node:test";
import assert from "node:assert/strict";
import { generateTicket } from "../../src/utils/ticket.utils";

test("generateTicket returns 14-digit numeric string", () => {
  const ticket = generateTicket();
  assert.equal(ticket.length, 14);
  assert.ok(/^[0-9]{14}$/.test(ticket));
});

test("generateTicket changes over time", async () => {
  const t1 = generateTicket();
  await new Promise((r) => setTimeout(r, 1000));
  const t2 = generateTicket();
  assert.notEqual(t1, t2);
});
