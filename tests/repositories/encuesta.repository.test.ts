import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { EncuestaRepository } from "../../src/repositories/encuesta.repository";
import { resetDb, seedCatalogs, seedPqrs } from "../helpers/db";

const repo = new EncuestaRepository();

beforeEach(async () => {
  await resetDb();
  await seedCatalogs();
});

test("encuesta: create/find", async () => {
  const { pqrs } = await seedPqrs({ statusId: 4 });
  const created = await repo.create({
    pqrsId: pqrs.id,
    q1Clarity: 5,
    q2Timeliness: 4,
    q3Quality: 5,
    q4Attention: 4,
    q5Overall: 5,
    comment: "ok",
  });

  const found = await repo.findById(created.id);
  assert.ok(found);

  const byPqrs = await repo.findByPqrsId(pqrs.id);
  assert.ok(byPqrs);
});
