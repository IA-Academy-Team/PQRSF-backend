import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "../helpers/testApp";
import { resetDb, seedCatalogs, seedClient, seedResponsible, seedPqrs } from "../helpers/db";
import prisma from "../../src/config/db.config";

let server: Awaited<ReturnType<typeof startTestServer>> | null = null;

beforeEach(async () => {
  await resetDb();
  await seedCatalogs();
  server = await startTestServer();
});

afterEach(async () => {
  if (server) {
    await server.close();
    server = null;
  }
});

test("API /pqrsf list", async () => {
  const client = await seedClient();
  await prisma.pqrs.create({
    data: {
      ticketNumber: `T-${Date.now()}`,
      description: "Prueba API",
      pqrsStatusId: 1,
      areaId: 1,
      typePqrsId: 1,
      clientId: client.id,
      dueDate: new Date(),
      isAutoResolved: false,
    },
  });

  const res = await fetch(`${server!.baseUrl}/pqrsf`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
});

test("API /pqrsf/analysis create", async () => {
  const { pqrs } = await seedPqrs();
  const responsible = await seedResponsible(pqrs.areaId);

  const res = await fetch(`${server!.baseUrl}/pqrsf/analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pqrsId: pqrs.id,
      responsibleId: responsible.id,
      answer: "ok",
      actionTaken: "act",
    }),
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.pqrsId, pqrs.id);
});

test("API /pqrsf/:id/appeal", async () => {
  const { pqrs } = await seedPqrs();
  const res = await fetch(`${server!.baseUrl}/pqrsf/${pqrs.id}/appeal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appeal: "apelacion" }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.pqrsStatusId, 3);
});
