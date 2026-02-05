import test from "node:test";
import assert from "node:assert/strict";
import { PqrsService } from "../../src/services/pqrs.service";
import { AppError } from "../../src/middlewares/error.middleware";
import { IPqrs } from "../../src/models/pqrs.model";

class FakePqrsRepo {
  created: any[] = [];
  updated: any[] = [];
  byId = new Map<number, IPqrs>();
  byTicket = new Map<string, IPqrs>();
  detailedById = new Map<number, any>();
  detailedByTicket = new Map<string, any>();
  botByTicket = new Map<string, any>();
  botById = new Map<number, any>();
  ticketArea = new Map<number, any>();

  async create(data: any) {
    const id = data.id ?? 1;
    const pqrs: IPqrs = {
      id,
      ticketNumber: data.ticketNumber,
      isAutoResolved: data.isAutoResolved,
      dueDate: data.dueDate ?? null,
      appeal: data.appeal ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      pqrsStatusId: data.pqrsStatusId,
      clientId: data.clientId,
      typePqrsId: data.typePqrsId,
      areaId: data.areaId,
    };
    this.created.push(data);
    this.byId.set(id, pqrs);
    this.byTicket.set(pqrs.ticketNumber, pqrs);
    return pqrs;
  }

  async findById(id: number) {
    return this.byId.get(id) ?? null;
  }

  async findDetailedById(id: number) {
    return this.detailedById.get(id) ?? null;
  }

  async findTicketAndAreaCode(id: number) {
    return this.ticketArea.get(id) ?? null;
  }

  async findAllWithFilters(filters: any) {
    this.lastFilters = filters;
    return [] as IPqrs[];
  }
  lastFilters: any = null;

  async findAllDetailed(filters: any) {
    this.lastDetailedFilters = filters;
    return [];
  }
  lastDetailedFilters: any = null;

  async findSeguimientoDetailed() {
    return [];
  }
  async findApelacionesDetailed() {
    return [];
  }
  async findCerradasDetailed() {
    return [];
  }

  async findByTicketNumber(ticket: string) {
    return this.byTicket.get(ticket) ?? null;
  }

  async findDetailedByTicketNumber(ticket: string) {
    return this.detailedByTicket.get(ticket) ?? null;
  }

  async findBotResponseByTicketNumber(ticket: string) {
    return this.botByTicket.get(ticket) ?? null;
  }

  async findBotResponseByPqrsId(id: number) {
    return this.botById.get(id) ?? null;
  }

  async update(data: any) {
    this.updated.push(data);
    const current = this.byId.get(data.id);
    if (!current) return null;
    const updated: IPqrs = {
      ...current,
      ...data,
    };
    this.byId.set(current.id, updated);
    return updated;
  }

  async delete({ id }: { id: number }) {
    return this.byId.delete(id);
  }
}

class FakeAreaRepo {
  areaIds = new Set<number>();
  async findById(id: number) {
    return this.areaIds.has(id) ? { id } : null;
  }
}

class FakeTipoPqrsRepo {
  ids = new Set<number>();
  async findById(id: number) {
    return this.ids.has(id) ? { id } : null;
  }
}

class FakeClienteRepo {
  ids = new Set<bigint>();
  async findById(id: bigint) {
    return this.ids.has(id) ? { id } : null;
  }
}

class FakeStatusHistoryService {
  calls: Array<{ id: number; statusId: number; note?: string }> = [];
  async logStatusChange(id: number, statusId: number, note?: string) {
    this.calls.push({ id, statusId, note });
  }
}

const seedPqrs = (overrides: Partial<IPqrs> = {}): IPqrs => ({
  id: 1,
  ticketNumber: "T-1",
  isAutoResolved: false,
  dueDate: new Date(),
  appeal: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  pqrsStatusId: 1,
  clientId: 1n,
  typePqrsId: 1,
  areaId: 1,
  ...overrides,
});

const createService = () => {
  const repo = new FakePqrsRepo();
  const areaRepo = new FakeAreaRepo();
  const tipoRepo = new FakeTipoPqrsRepo();
  const clienteRepo = new FakeClienteRepo();
  const history = new FakeStatusHistoryService();
  const service = new PqrsService(repo as any, areaRepo as any, tipoRepo as any, clienteRepo as any, history as any);
  return { service, repo, areaRepo, tipoRepo, clienteRepo, history };
};

test("create: validates related entities and generates ticket", async () => {
  const { service, repo, areaRepo, tipoRepo, clienteRepo } = createService();
  areaRepo.areaIds.add(1);
  tipoRepo.ids.add(1);
  clienteRepo.ids.add(1n);

  const created = await service.create({
    clientId: 1n,
    typePqrsId: 1,
    areaId: 1,
    description: "desc",
  } as any);

  assert.equal(created.clientId, 1n);
  assert.ok(created.ticketNumber.length >= 14);
  assert.equal(repo.created.length, 1);
});

test("create: throws when client/area/type missing", async () => {
  const { service } = createService();
  await assert.rejects(
    () =>
      service.create({
        clientId: 1n,
        typePqrsId: 1,
        areaId: 1,
        description: "desc",
      } as any),
    AppError
  );
});

test("create: enforces autoResolved rules", async () => {
  const { service, areaRepo, tipoRepo, clienteRepo } = createService();
  areaRepo.areaIds.add(1);
  tipoRepo.ids.add(1);
  clienteRepo.ids.add(1n);

  await assert.rejects(
    () =>
      service.create({
        clientId: 1n,
        typePqrsId: 1,
        areaId: 1,
        isAutoResolved: true,
        pqrsStatusId: 1,
      } as any),
    AppError
  );

  await assert.rejects(
    () =>
      service.create({
        clientId: 1n,
        typePqrsId: 1,
        areaId: 1,
        isAutoResolved: false,
        pqrsStatusId: 4,
      } as any),
    AppError
  );
});

test("create: rejects duplicate ticket", async () => {
  const { service, repo, areaRepo, tipoRepo, clienteRepo } = createService();
  areaRepo.areaIds.add(1);
  tipoRepo.ids.add(1);
  clienteRepo.ids.add(1n);
  repo.byTicket.set("ABC", seedPqrs({ ticketNumber: "ABC" }));

  await assert.rejects(
    () =>
      service.create({
        clientId: 1n,
        typePqrsId: 1,
        areaId: 1,
        ticketNumber: "ABC",
      } as any),
    AppError
  );
});

test("findById and findDetailedById not found", async () => {
  const { service } = createService();
  await assert.rejects(() => service.findById(99), AppError);
  await assert.rejects(() => service.findDetailedById(99), AppError);
});

test("findTicketAndAreaCode not found", async () => {
  const { service } = createService();
  await assert.rejects(() => service.findTicketAndAreaCode(1), AppError);
});

test("list and listDetailed validate filters", async () => {
  const { service, repo } = createService();
  await service.list({ pqrsStatusId: 1, areaId: 2, clientId: "3" as any });
  assert.equal(repo.lastFilters.clientId, 3n);

  await service.listDetailed({ sort: "recent" as any, q: "hello" });
  assert.equal(repo.lastDetailedFilters.sort, "recent");
});

test("findByTicketNumber/not found", async () => {
  const { service } = createService();
  await assert.rejects(() => service.findByTicketNumber("NO"), AppError);
});

test("update: requires fields", async () => {
  const { service, repo } = createService();
  repo.byId.set(1, seedPqrs());
  await assert.rejects(() => service.update({ id: 1 } as any), AppError);
});

test("update: validates transitions and logs history", async () => {
  const { service, repo, history } = createService();
  repo.byId.set(1, seedPqrs({ pqrsStatusId: 1, isAutoResolved: false }));

  await assert.rejects(
    () => service.update({ id: 1, pqrsStatusId: 4 } as any),
    AppError
  );

  const updated = await service.update({ id: 1, pqrsStatusId: 2 } as any);
  assert.equal(updated.pqrsStatusId, 2);
  assert.equal(history.calls.length, 1);
  assert.equal(history.calls[0].statusId, 2);
});

test("update: validates references when provided", async () => {
  const { service, repo, areaRepo, tipoRepo, clienteRepo } = createService();
  repo.byId.set(1, seedPqrs());

  await assert.rejects(
    () => service.update({ id: 1, areaId: 2 } as any),
    AppError
  );

  areaRepo.areaIds.add(2);
  tipoRepo.ids.add(3);
  clienteRepo.ids.add(9n);

  const updated = await service.update({ id: 1, areaId: 2, typePqrsId: 3, clientId: 9n } as any);
  assert.equal(updated.areaId, 2);
  assert.equal(updated.typePqrsId, 3);
  assert.equal(updated.clientId, 9n);
});

test("finalize: closes and logs", async () => {
  const { service, repo, history } = createService();
  repo.byId.set(1, seedPqrs({ pqrsStatusId: 2, isAutoResolved: false }));
  const result = await service.finalize(1);
  assert.equal(result.pqrsStatusId, 4);
  assert.equal(history.calls.length, 1);
});

test("finalize: rejects invalid transition", async () => {
  const { service, repo } = createService();
  repo.byId.set(1, seedPqrs({ pqrsStatusId: 1, isAutoResolved: false }));
  await assert.rejects(() => service.finalize(1), AppError);
});

test("appeal: transitions between reanalisis/devuelto", async () => {
  const { service, repo, history } = createService();
  repo.byId.set(1, seedPqrs({ pqrsStatusId: 2 }));

  const r1 = await service.appeal(1, "note");
  assert.equal(r1.pqrsStatusId, 3);

  const r2 = await service.appeal(1);
  assert.equal(r2.pqrsStatusId, 5);

  const r3 = await service.appeal(1);
  assert.equal(r3.pqrsStatusId, 3);

  assert.equal(history.calls.length, 3);
});
