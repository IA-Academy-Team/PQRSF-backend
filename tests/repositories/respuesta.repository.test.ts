import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import prisma from "../../src/config/db.config";
import { RespuestaRepository } from "../../src/repositories/respuesta.repository";
import { resetDb, seedCatalogs, seedPqrs, seedResponsible } from "../helpers/db";

const repo = new RespuestaRepository();

beforeEach(async () => {
  await resetDb();
  await seedCatalogs();
});

test("respuesta: create/find", async () => {
  const { pqrs } = await seedPqrs();
  const responsible = await seedResponsible(pqrs.areaId);

  const created = await repo.create({
    content: "respuesta",
    channel: 3,
    documentId: null,
    pqrsId: pqrs.id,
    responsibleId: responsible.id,
  });

  assert.equal(created.content, "respuesta");

  const found = await repo.findById(created.id);
  assert.ok(found);
  assert.equal(found?.id, created.id);

  const list = await repo.findByPqrsId(pqrs.id);
  assert.equal(list.length, 1);
});
