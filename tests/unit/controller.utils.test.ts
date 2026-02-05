import test from "node:test";
import assert from "node:assert/strict";
import {
  asyncHandler,
  parseNumberParam,
  parseBigIntParam,
  parseOptionalNumberQuery,
  parseOptionalDateQuery,
} from "../../src/utils/controller.utils";
import { AppError } from "../../src/middlewares/error.middleware";

test("parseNumberParam accepts positive integers", () => {
  assert.equal(parseNumberParam("5", "id"), 5);
  assert.equal(parseNumberParam(3, "id"), 3);
  assert.throws(() => parseNumberParam("0", "id"), AppError);
  assert.throws(() => parseNumberParam("-1", "id"), AppError);
  assert.throws(() => parseNumberParam("x", "id"), AppError);
});

test("parseBigIntParam accepts bigint/number/string", () => {
  assert.equal(parseBigIntParam(1n, "clientId"), 1n);
  assert.equal(parseBigIntParam(7, "clientId"), 7n);
  assert.equal(parseBigIntParam("99", "clientId"), 99n);
  assert.throws(() => parseBigIntParam("9.9", "clientId"), AppError);
});

test("parseOptionalNumberQuery", () => {
  assert.equal(parseOptionalNumberQuery(undefined, "id"), undefined);
  assert.equal(parseOptionalNumberQuery("", "id"), undefined);
  assert.equal(parseOptionalNumberQuery("3", "id"), 3);
});

test("parseOptionalDateQuery", () => {
  assert.equal(parseOptionalDateQuery(undefined, "from"), undefined);
  assert.equal(parseOptionalDateQuery("", "from"), undefined);
  assert.ok(parseOptionalDateQuery("2025-01-01", "from") instanceof Date);
  assert.throws(() => parseOptionalDateQuery("not-a-date", "from"), AppError);
});

test("asyncHandler forwards errors to next", async () => {
  const error = new Error("boom");
  const handler = asyncHandler(async () => {
    throw error;
  });

  let received: unknown = null;
  const next = (err?: unknown) => {
    received = err ?? null;
  };

  await handler({} as any, {} as any, next as any);
  assert.equal(received, error);
});
