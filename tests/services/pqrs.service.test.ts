import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { PqrsService } from "../../src/services/pqrs.service";
import { resetDb, seedCatalogs, seedClient } from "../helpers/db";

const service = new PqrsService();

beforeEach(async () => {
  await resetDb();
  await seedCatalogs();
});

test("pqrs service: create en Radicado", async () => {
  const client = await seedClient();
  const created = await service.create({
    clientId: client.id,
    typePqrsId: 1,
    areaId: 1,
    isAutoResolved: false,
    dueDate: new Date(),
  });
  assert.equal(created.pqrsStatusId, 1);
});

test("pqrs service: finalize", async () => {
  const client = await seedClient();
  const created = await service.create({
    clientId: client.id,
    typePqrsId: 1,
    areaId: 1,
    isAutoResolved: false,
    dueDate: new Date(),
  });
  const finalized = await service.finalize(created.id);
  assert.equal(finalized.pqrsStatusId, 4);
});

test("pqrs service: appeal alterna REANALISIS/DEVUELTO", async () => {
  const client = await seedClient();
  const created = await service.create({
    clientId: client.id,
    typePqrsId: 1,
    areaId: 1,
    isAutoResolved: false,
    dueDate: new Date(),
  });

  const first = await service.appeal(created.id, "apelacion 1");
  assert.equal(first.pqrsStatusId, 3);

  const second = await service.appeal(created.id, "apelacion 2");
  assert.equal(second.pqrsStatusId, 5);
});
