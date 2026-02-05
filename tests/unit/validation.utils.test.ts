import test from "node:test";
import assert from "node:assert/strict";
import {
  requireString,
  optionalString,
  requireEmail,
  optionalEmail,
  requireBoolean,
  optionalBoolean,
  requireNumber,
  requirePositiveInt,
  optionalPositiveInt,
  requireBigInt,
  optionalBigInt,
  requireDate,
  optionalDate,
  ensureUpdates,
  ensureEnum,
  ensureFound,
  normalizeValues,
} from "../../src/utils/validation.utils";
import { AppError } from "../../src/middlewares/error.middleware";

test("requireString trims and validates", () => {
  assert.equal(requireString("  hola  ", "field"), "hola");
  assert.throws(() => requireString("", "field"), AppError);
  assert.throws(() => requireString("   ", "field"), AppError);
  assert.throws(() => requireString(123 as any, "field"), AppError);
});

test("optionalString handles undefined/null", () => {
  assert.equal(optionalString(undefined, "field"), undefined);
  assert.equal(optionalString(null, "field"), null);
  assert.equal(optionalString(" hi ", "field"), "hi");
});

test("requireEmail validates format and lowercases", () => {
  assert.equal(requireEmail("TEST@MAIL.COM", "email"), "test@mail.com");
  assert.throws(() => requireEmail("not-an-email", "email"), AppError);
});

test("optionalEmail handles undefined/null", () => {
  assert.equal(optionalEmail(undefined, "email"), undefined);
  assert.equal(optionalEmail(null, "email"), null);
  assert.equal(optionalEmail("user@site.com", "email"), "user@site.com");
});

test("requireBoolean and optionalBoolean", () => {
  assert.equal(requireBoolean(true, "flag"), true);
  assert.throws(() => requireBoolean("true" as any, "flag"), AppError);
  assert.equal(optionalBoolean(undefined, "flag"), undefined);
  assert.equal(optionalBoolean(false, "flag"), false);
});

test("requireNumber and requirePositiveInt", () => {
  assert.equal(requireNumber(3.5, "num"), 3.5);
  assert.throws(() => requireNumber(NaN, "num"), AppError);
  assert.equal(requirePositiveInt(3, "id"), 3);
  assert.throws(() => requirePositiveInt(0, "id"), AppError);
  assert.throws(() => requirePositiveInt(-1, "id"), AppError);
  assert.throws(() => requirePositiveInt(2.2, "id"), AppError);
});

test("optionalPositiveInt", () => {
  assert.equal(optionalPositiveInt(undefined, "id"), undefined);
  assert.equal(optionalPositiveInt(7, "id"), 7);
});

test("requireBigInt accepts bigint, int number, numeric string", () => {
  assert.equal(requireBigInt(1n, "id"), 1n);
  assert.equal(requireBigInt(10, "id"), 10n);
  assert.equal(requireBigInt("42", "id"), 42n);
  assert.throws(() => requireBigInt("4.2", "id"), AppError);
  assert.throws(() => requireBigInt(4.2 as any, "id"), AppError);
});

test("optionalBigInt", () => {
  assert.equal(optionalBigInt(undefined, "id"), undefined);
  assert.equal(optionalBigInt(null, "id"), null);
  assert.equal(optionalBigInt("7", "id"), 7n);
});

test("requireDate handles Date/string/number", () => {
  const now = new Date();
  assert.equal(requireDate(now, "date"), now);
  assert.ok(requireDate(now.toISOString(), "date") instanceof Date);
  assert.ok(requireDate(Date.now(), "date") instanceof Date);
  assert.throws(() => requireDate("invalid", "date"), AppError);
});

test("optionalDate", () => {
  assert.equal(optionalDate(undefined, "date"), undefined);
  assert.equal(optionalDate(null, "date"), null);
  assert.ok(optionalDate(new Date().toISOString(), "date") instanceof Date);
});

test("ensureUpdates requires at least one field", () => {
  assert.throws(() => ensureUpdates({}, ["a", "b"], "Entity"), AppError);
  ensureUpdates({ a: 1 }, ["a", "b"], "Entity");
});

test("ensureEnum", () => {
  assert.equal(ensureEnum("a", "field", ["a", "b"] as const), "a");
  assert.throws(() => ensureEnum("c", "field", ["a", "b"] as const), AppError);
});

test("ensureFound", () => {
  assert.equal(ensureFound("Entity", { id: 1 }, { id: 1 }).id, 1);
  assert.throws(() => ensureFound("Entity", null, { id: 1 }), AppError);
});

test("normalizeValues converts bigint and preserves structure", () => {
  const input = [1n, { a: 2n, b: [3n] }, null, "x"];
  const normalized = normalizeValues(input) as any;
  assert.equal(normalized[0], "1");
  assert.equal(normalized[1].a, "2");
  assert.deepEqual(normalized[1].b, [["3"]]);
  assert.equal(normalized[2], null);
  assert.equal(normalized[3], "x");
});
