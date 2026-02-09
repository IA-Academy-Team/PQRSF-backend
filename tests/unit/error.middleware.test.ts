import test from "node:test";
import assert from "node:assert/strict";
import { errorHandler, AppError } from "../../src/middlewares/error.middleware";
import { ZodError, z } from "zod";

type MockRes = {
  statusCode: number;
  body: unknown;
  status: (code: number) => MockRes;
  json: (payload: unknown) => MockRes;
};

const createRes = (): MockRes => {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  } as MockRes;
  return res;
};

const createReq = (method = "GET", path = "/test") => ({
  method,
  originalUrl: path,
});

const noopNext = () => {};

test("errorHandler handles AppError and sanitizes bigint", () => {
  const req = createReq("POST", "/api/test");
  const res = createRes();
  const err = new AppError("Bad", 400, "VALIDATION_ERROR", { id: 1n, nested: { x: 2n } });

  errorHandler(err, req as any, res as any, noopNext);

  assert.equal(res.statusCode, 400);
  const body = res.body as any;
  assert.equal(body.error.code, "VALIDATION_ERROR");
  assert.equal(body.error.details.id, "1");
  assert.equal(body.error.details.nested.x, "2");
});

test("errorHandler handles ZodError", () => {
  const req = createReq();
  const res = createRes();
  const schema = z.object({ email: z.string().email() });
  const result = schema.safeParse({ email: "not" });
  const err = result.success ? new Error("no") : (result.error as ZodError);

  errorHandler(err, req as any, res as any, noopNext);

  assert.equal(res.statusCode, 400);
  const body = res.body as any;
  assert.equal(body.error.code, "VALIDATION_ERROR");
  assert.ok(Array.isArray(body.error.details.issues));
});

test("errorHandler handles unknown errors", () => {
  const req = createReq();
  const res = createRes();

  errorHandler(new Error("boom"), req as any, res as any, noopNext);

  assert.equal(res.statusCode, 500);
  const body = res.body as any;
  assert.equal(body.error.code, "INTERNAL_ERROR");
});
