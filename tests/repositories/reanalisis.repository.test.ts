import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import prisma from "../../src/config/db.config";
import { ReanalisisRepository } from "../../src/repositories/reanalisis.repository";
import { resetDb, seedCatalogs, seedPqrs, seedResponsible } from "../helpers/db";

const repo = new ReanalisisRepository();

beforeEach(async () => {
  await resetDb();
  await seedCatalogs();
});

test("reanalysis: create/find by analysis", async () => {
  const { pqrs } = await seedPqrs();
  const responsible = await seedResponsible(pqrs.areaId);
  const analysis = await prisma.analysis.create({
    data: { pqrsId: pqrs.id, responsibleId: responsible.id, answer: "ok", actionTaken: "act" },
  });

  const created = await repo.create({
    analysisId: analysis.id,
    responsibleId: responsible.id,
    answer: "resp",
    actionTaken: "act2",
  });

  const byAnalysis = await repo.findByAnalysisId(analysis.id);
  assert.ok(byAnalysis);
  assert.equal(byAnalysis?.id, created.id);
});

test("reanalysis: find by pqrs id", async () => {
  const { pqrs } = await seedPqrs();
  const responsible = await seedResponsible(pqrs.areaId);
  const analysis = await prisma.analysis.create({
    data: { pqrsId: pqrs.id, responsibleId: responsible.id, answer: "ok", actionTaken: "act" },
  });
  await repo.create({ analysisId: analysis.id, responsibleId: responsible.id, answer: "r1", actionTaken: "a1" });

  const found = await repo.findByPqrsId(pqrs.id);
  assert.ok(found);
  assert.equal(found?.analysisId, analysis.id);
});
