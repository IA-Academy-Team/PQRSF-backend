import test, { after } from "node:test";
import assert from "node:assert/strict";
import {
  createRespuesta,
  getRespuestaById,
  listRespuestasByPqrs,
  createRespuestaForPqrs,
  updateRespuesta,
  deleteRespuesta,
} from "../../../src/controllers/respuesta.controller";
import { RespuestaService } from "../../../src/services/respuesta.service";

const createRes = () => {
  return {
    statusCode: 200,
    body: undefined as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    },
  };
};

const createNext = () => {
  let called = false;
  let error: unknown = null;
  const next = (err?: unknown) => {
    called = true;
    error = err ?? null;
  };
  return { next, get called() { return called; }, get error() { return error; } };
};

const original = {
  create: RespuestaService.prototype.create,
  findById: RespuestaService.prototype.findById,
  listByPqrsId: RespuestaService.prototype.listByPqrsId,
  update: RespuestaService.prototype.update,
  delete: RespuestaService.prototype.delete,
};

after(() => {
  RespuestaService.prototype.create = original.create;
  RespuestaService.prototype.findById = original.findById;
  RespuestaService.prototype.listByPqrsId = original.listByPqrsId;
  RespuestaService.prototype.update = original.update;
  RespuestaService.prototype.delete = original.delete;
});

test("respuesta controller: create", async () => {
  RespuestaService.prototype.create = async (data: any) => ({ id: 1, ...data });
  const req = { body: { content: "ok", channel: 1, pqrsId: 1, responsibleId: 2 } } as any;
  const res = createRes();
  await createRespuesta(req, res as any, (() => {}) as any);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.content, "ok");
});

test("respuesta controller: get by id", async () => {
  RespuestaService.prototype.findById = async (id: number) => ({ id, content: "x" } as any);
  const req = { params: { id: "3" } } as any;
  const res = createRes();
  await getRespuestaById(req, res as any, (() => {}) as any);
  assert.equal(res.body.id, 3);
});

test("respuesta controller: list by pqrs", async () => {
  RespuestaService.prototype.listByPqrsId = async () => [{ id: 1 } as any];
  const req = { params: { pqrsfId: "9" } } as any;
  const res = createRes();
  await listRespuestasByPqrs(req, res as any, (() => {}) as any);
  assert.equal(res.body.length, 1);
});

test("respuesta controller: create for pqrs", async () => {
  RespuestaService.prototype.create = async (data: any) => ({ id: 1, ...data });
  const req = { params: { pqrsfId: "5" }, body: { content: "ok", channel: 2, responsibleId: 7 } } as any;
  const res = createRes();
  await createRespuestaForPqrs(req, res as any, (() => {}) as any);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.pqrsId, 5);
});

test("respuesta controller: update", async () => {
  RespuestaService.prototype.update = async (data: any) => ({ id: data.id, ...data });
  const req = { params: { id: "2" }, body: { content: "new" } } as any;
  const res = createRes();
  await updateRespuesta(req, res as any, (() => {}) as any);
  assert.equal(res.body.id, 2);
  assert.equal(res.body.content, "new");
});

test("respuesta controller: delete", async () => {
  RespuestaService.prototype.delete = async () => true;
  const req = { params: { id: "2" } } as any;
  const res = createRes();
  await deleteRespuesta(req, res as any, (() => {}) as any);
  assert.deepEqual(res.body, { deleted: true });
});

test("respuesta controller: invalid payload forwards error", async () => {
  const req = { body: { content: "" } } as any;
  const res = createRes();
  const state = createNext();
  await createRespuesta(req, res as any, state.next as any);
  assert.equal(state.called, true);
  assert.ok(state.error);
});
