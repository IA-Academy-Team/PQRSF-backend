import test, { after } from "node:test";
import assert from "node:assert/strict";
import {
  listAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
} from "../../../src/controllers/area.controller";
import { AreaService } from "../../../src/services/area.service";

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
  list: AreaService.prototype.list,
  findById: AreaService.prototype.findById,
  create: AreaService.prototype.create,
  update: AreaService.prototype.update,
  delete: AreaService.prototype.delete,
};

test("area controller: list", async () => {
  AreaService.prototype.list = async () => [{ id: 1, name: "A" } as any];
  const res = createRes();
  await listAreas({} as any, res as any, (() => {}) as any);
  assert.deepEqual(res.body, [{ id: 1, name: "A" }]);
});

test("area controller: get by id", async () => {
  AreaService.prototype.findById = async (id: number) => ({ id, name: "A" } as any);
  const req = { params: { id: "1" } } as any;
  const res = createRes();
  await getAreaById(req, res as any, (() => {}) as any);
  assert.equal(res.body.id, 1);
});

test("area controller: create", async () => {
  AreaService.prototype.create = async (data: any) => ({ id: 5, ...data });
  const req = { body: { name: "Area", code: "A" } } as any;
  const res = createRes();
  await createArea(req, res as any, (() => {}) as any);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.name, "Area");
});

test("area controller: update", async () => {
  AreaService.prototype.update = async (data: any) => ({ id: data.id, ...data });
  const req = { params: { id: "2" }, body: { name: "New" } } as any;
  const res = createRes();
  await updateArea(req, res as any, (() => {}) as any);
  assert.equal(res.body.id, 2);
  assert.equal(res.body.name, "New");
});

test("area controller: delete", async () => {
  AreaService.prototype.delete = async () => true;
  const req = { params: { id: "3" } } as any;
  const res = createRes();
  await deleteArea(req, res as any, (() => {}) as any);
  assert.deepEqual(res.body, { deleted: true });
});

test("area controller: invalid id forwards error", async () => {
  const req = { params: { id: "x" } } as any;
  const res = createRes();
  const state = createNext();
  await getAreaById(req, res as any, state.next as any);
  assert.equal(state.called, true);
  assert.ok(state.error);
});

after(() => {
  AreaService.prototype.list = original.list;
  AreaService.prototype.findById = original.findById;
  AreaService.prototype.create = original.create;
  AreaService.prototype.update = original.update;
  AreaService.prototype.delete = original.delete;
});
