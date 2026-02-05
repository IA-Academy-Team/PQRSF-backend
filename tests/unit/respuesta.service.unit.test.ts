import test from "node:test";
import assert from "node:assert/strict";
import { RespuestaService } from "../../src/services/respuesta.service";
import { AppError } from "../../src/middlewares/error.middleware";
import { IRespuesta } from "../../src/models/respuesta.model";

class FakeRespuestaRepo {
  responses: IRespuesta[] = [];
  created: any[] = [];
  updated: any[] = [];
  deleted: number[] = [];

  async create(data: any) {
    const created: IRespuesta = {
      id: this.responses.length + 1,
      content: data.content,
      channel: data.channel,
      sentAt: data.sentAt ?? new Date(),
      documentId: data.documentId ?? null,
      pqrsId: data.pqrsId,
      responsibleId: data.responsibleId,
    } as any;
    this.responses.push(created);
    this.created.push(data);
    return created;
  }

  async findById(id: number) {
    return this.responses.find((r) => r.id === id) ?? null;
  }

  async findByPqrsId(pqrsId: number) {
    return this.responses.filter((r) => r.pqrsId === pqrsId);
  }

  async update(data: any) {
    this.updated.push(data);
    const idx = this.responses.findIndex((r) => r.id === data.id);
    if (idx === -1) return null;
    const current = this.responses[idx];
    const updated = { ...current, ...data } as IRespuesta;
    this.responses[idx] = updated;
    return updated;
  }

  async delete({ id }: { id: number }) {
    this.deleted.push(id);
    const before = this.responses.length;
    this.responses = this.responses.filter((r) => r.id !== id);
    return this.responses.length < before;
  }
}

class FakeDocumentoRepo {
  ids = new Set<number>();
  async findById(id: number) {
    return this.ids.has(id) ? { id } : null;
  }
}

class FakePqrsRepo {
  pqrs = new Map<number, { id: number; pqrsStatusId: number }>();
  updates: any[] = [];

  async findById(id: number) {
    return this.pqrs.get(id) ?? null;
  }

  async update(data: any) {
    this.updates.push(data);
    const current = this.pqrs.get(data.id);
    if (!current) return null;
    const updated = { ...current, ...data };
    this.pqrs.set(data.id, updated);
    return updated;
  }
}

class FakeResponsableRepo {
  ids = new Set<number>();
  async findById(id: number) {
    return this.ids.has(id) ? { id } : null;
  }
}

const createService = () => {
  const repo = new FakeRespuestaRepo();
  const documentoRepo = new FakeDocumentoRepo();
  const pqrsRepo = new FakePqrsRepo();
  const responsableRepo = new FakeResponsableRepo();
  const service = new RespuestaService(
    repo as any,
    documentoRepo as any,
    pqrsRepo as any,
    responsableRepo as any
  );
  return { service, repo, documentoRepo, pqrsRepo, responsableRepo };
};

test("create: validates channel", async () => {
  const { service, pqrsRepo, responsableRepo } = createService();
  pqrsRepo.pqrs.set(1, { id: 1, pqrsStatusId: 1 });
  responsableRepo.ids.add(1);

  await assert.rejects(
    () =>
      service.create({
        content: "x",
        channel: 9,
        pqrsId: 1,
        responsibleId: 1,
      } as any),
    AppError
  );
});

test("create: validates references and prevents duplicates", async () => {
  const { service, repo, documentoRepo, pqrsRepo, responsableRepo } = createService();
  pqrsRepo.pqrs.set(1, { id: 1, pqrsStatusId: 2 });
  responsableRepo.ids.add(1);
  documentoRepo.ids.add(10);

  repo.responses.push({
    id: 1,
    content: "old",
    channel: 1,
    sentAt: new Date(),
    documentId: null,
    pqrsId: 1,
    responsibleId: 1,
  } as any);

  await assert.rejects(
    () =>
      service.create({
        content: "x",
        channel: 1,
        pqrsId: 1,
        responsibleId: 1,
      } as any),
    AppError
  );
});

test("create: updates status from radicado when first response", async () => {
  const { service, repo, pqrsRepo, responsableRepo } = createService();
  pqrsRepo.pqrs.set(1, { id: 1, pqrsStatusId: 1 });
  responsableRepo.ids.add(1);

  const created = await service.create({
    content: "new",
    channel: 2,
    pqrsId: 1,
    responsibleId: 1,
  } as any);

  assert.equal(created.content, "new");
  assert.equal(pqrsRepo.updates.length, 1);
  assert.equal(pqrsRepo.updates[0].pqrsStatusId, 2);
});

test("create: allows duplicate when status reanalysis/devuelto", async () => {
  const { service, repo, pqrsRepo, responsableRepo } = createService();
  pqrsRepo.pqrs.set(1, { id: 1, pqrsStatusId: 3 });
  responsableRepo.ids.add(1);

  repo.responses.push({
    id: 1,
    content: "old",
    channel: 1,
    sentAt: new Date(),
    documentId: null,
    pqrsId: 1,
    responsibleId: 1,
  } as any);

  const created = await service.create({
    content: "new",
    channel: 3,
    pqrsId: 1,
    responsibleId: 1,
  } as any);

  assert.equal(created.channel, 3);
});

test("update: requires fields and validates references", async () => {
  const { service, repo, documentoRepo, pqrsRepo, responsableRepo } = createService();
  repo.responses.push({
    id: 1,
    content: "old",
    channel: 1,
    sentAt: new Date(),
    documentId: null,
    pqrsId: 1,
    responsibleId: 1,
  } as any);

  await assert.rejects(() => service.update({ id: 1 } as any), AppError);

  await assert.rejects(
    () => service.update({ id: 1, channel: 5 } as any),
    AppError
  );

  documentoRepo.ids.add(10);
  pqrsRepo.pqrs.set(2, { id: 2, pqrsStatusId: 2 });
  responsableRepo.ids.add(2);

  const updated = await service.update({
    id: 1,
    content: "new",
    channel: 2,
    documentId: 10,
    pqrsId: 2,
    responsibleId: 2,
  } as any);

  assert.equal(updated.content, "new");
  assert.equal(updated.channel, 2);
});

test("find/list/delete", async () => {
  const { service, repo } = createService();
  repo.responses.push({
    id: 1,
    content: "old",
    channel: 1,
    sentAt: new Date(),
    documentId: null,
    pqrsId: 5,
    responsibleId: 1,
  } as any);

  const found = await service.findById(1);
  assert.equal(found.id, 1);

  const list = await service.listByPqrsId(5);
  assert.equal(list.length, 1);

  const deleted = await service.delete({ id: 1 } as any);
  assert.equal(deleted, true);
});
