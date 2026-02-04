import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { PqrsStatusHistoryRepository } from "../../src/repositories/pqrsStatusHistory.repository";
import { resetDb, seedCatalogs, seedPqrs } from "../helpers/db";

const repo = new PqrsStatusHistoryRepository();

beforeEach(async () => {
  await resetDb();
  await seedCatalogs();
});

test("pqrsStatusHistory: create + list", async () => {
  const { pqrs } = await seedPqrs();
  const created = await repo.create({ pqrsId: pqrs.id, statusId: 1, note: "init" });
  assert.ok(created.id);
  assert.equal(created.pqrsId, pqrs.id);
  assert.equal(created.statusId, 1);
  assert.equal(created.note, "init");

  const list = await repo.listByPqrsId(pqrs.id);
  assert.equal(list.length, 1);
  assert.equal(list[0].statusName, "Radicado");
});
