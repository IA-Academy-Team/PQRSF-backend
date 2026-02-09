import { AppError } from "../middlewares/error.middleware";
import { CreatePqrsDTO, DeletePqrsDTO, UpdatePqrsDTO } from "../schemas/pqrs.schema";
import { IPqrs } from "../models/pqrs.model";
import {
  PqrsRepository,
  PqrsDetailedFilters,
  PqrsFilters,
  PqrsBotResponseView,
  PqrsDetailedView,
  PqrsTicketArea,
} from "../repositories/pqrs.repository";
import { AreaRepository } from "../repositories/area.repository";
import { TipoPqrsRepository } from "../repositories/tipoPqrs.repository";
import { ClienteRepository } from "../repositories/cliente.repository";
import { PqrsStatusHistoryService } from "./pqrsStatusHistory.service";
import { calculateDueDate } from "../utils/date.utils";
import { generateTicket } from "../utils/ticket.utils";
import {
  ensureFound,
  ensureUpdates,
  optionalBoolean,
  optionalDate,
  optionalPositiveInt,
  optionalString,
  ensureEnum,
  requireBigInt,
  requireDate,
  requirePositiveInt,
  requireString,
} from "../utils/validation.utils";

const PQRS_STATUS = {
  RADICADO: 1,
  ANALISIS: 2,
  REANALISIS: 3,
  CERRADO: 4,
  DEVUELTO: 5,
} as const;

type PqrsStatusId = (typeof PQRS_STATUS)[keyof typeof PQRS_STATUS];

export class PqrsService {
  constructor(
    private readonly repo = new PqrsRepository(),
    private readonly areaRepo = new AreaRepository(),
    private readonly tipoPqrsRepo = new TipoPqrsRepository(),
    private readonly clienteRepo = new ClienteRepository(),
    private readonly statusHistoryService = new PqrsStatusHistoryService()
  ) {}

  private validateTransition(current: number, next: number, isAutoResolved: boolean) {
    const allowed: Record<number, number[]> = {
      [PQRS_STATUS.RADICADO]: [PQRS_STATUS.ANALISIS, PQRS_STATUS.CERRADO],
      [PQRS_STATUS.ANALISIS]: [PQRS_STATUS.REANALISIS, PQRS_STATUS.CERRADO],
      [PQRS_STATUS.REANALISIS]: [PQRS_STATUS.CERRADO, PQRS_STATUS.DEVUELTO],
      [PQRS_STATUS.DEVUELTO]: [PQRS_STATUS.REANALISIS, PQRS_STATUS.CERRADO],
    };

    if (current === PQRS_STATUS.RADICADO && next === PQRS_STATUS.CERRADO) {
      if (!isAutoResolved) {
        throw new AppError(
          "PQRS cannot be closed directly unless it is auto resolved",
          409,
          "BUSINESS_RULE_VIOLATION"
        );
      }
      return;
    }

    if (!allowed[current]?.includes(next)) {
      throw new AppError(
        `Invalid status transition ${current} -> ${next}`,
        409,
        "BUSINESS_RULE_VIOLATION",
        { current, next }
      );
    }
  }

  async create(data: CreatePqrsDTO): Promise<IPqrs> {
    const clientId = requireBigInt(data.clientId, "clientId");
    const typePqrsId = requirePositiveInt(data.typePqrsId, "typePqrsId");
    const areaId = requirePositiveInt(data.areaId, "areaId");
    const isAutoResolved = optionalBoolean(
      data.isAutoResolved,
      "isAutoResolved"
    ) ?? false;

    ensureFound(
      "Client",
      await this.clienteRepo.findById(clientId),
      { clientId }
    );
    ensureFound(
      "Area",
      await this.areaRepo.findById(areaId),
      { areaId }
    );
    ensureFound(
      "TypePqrs",
      await this.tipoPqrsRepo.findById(typePqrsId),
      { typePqrsId }
    );

    const ticketNumber = data.ticketNumber
      ? requireString(data.ticketNumber, "ticketNumber")
      : generateTicket();
    const existingTicket = await this.repo.findByTicketNumber(ticketNumber);
    if (existingTicket) {
      throw new AppError(
        "Ticket number already exists",
        409,
        "CONFLICT",
        { ticketNumber }
      );
    }

    const dueDate =
      data.dueDate === undefined || data.dueDate === null
        ? new Date(calculateDueDate(15))
        : requireDate(data.dueDate, "dueDate");

    const statusId =
      data.pqrsStatusId ?? (isAutoResolved ? PQRS_STATUS.CERRADO : PQRS_STATUS.RADICADO);

    if (isAutoResolved && statusId !== PQRS_STATUS.CERRADO) {
      throw new AppError(
        "Auto-resolved PQRS must start as Cerrado",
        409,
        "BUSINESS_RULE_VIOLATION"
      );
    }
    if (!isAutoResolved && statusId !== PQRS_STATUS.RADICADO) {
      throw new AppError(
        "Non auto-resolved PQRS must start as Radicado",
        409,
        "BUSINESS_RULE_VIOLATION"
      );
    }

    return this.repo.create({
      ticketNumber,
      isAutoResolved,
      dueDate,
      pqrsStatusId: statusId,
      clientId,
      typePqrsId,
      areaId,
      appeal: optionalString(data.appeal, "appeal") ?? null,
    });
  }

  async findById(id: number): Promise<IPqrs> {
    const pqrs = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("PQRS", pqrs, { id });
  }

  async findDetailedById(id: number): Promise<PqrsDetailedView> {
    const pqrs = await this.repo.findDetailedById(requirePositiveInt(id, "id"));
    return ensureFound("PQRS", pqrs, { id });
  }

  async findTicketAndAreaCode(pqrsId: number): Promise<PqrsTicketArea> {
    const id = requirePositiveInt(pqrsId, "pqrsId");
    const data = await this.repo.findTicketAndAreaCode(id);
    return ensureFound("PQRS", data, { pqrsId: id });
  }

  async list(filters: PqrsFilters): Promise<IPqrs[]> {
    const validated: PqrsFilters = {
      pqrsStatusId: optionalPositiveInt(filters.pqrsStatusId, "pqrsStatusId"),
      areaId: optionalPositiveInt(filters.areaId, "areaId"),
      typePqrsId: optionalPositiveInt(filters.typePqrsId, "typePqrsId"),
      clientId: filters.clientId !== undefined ? requireBigInt(filters.clientId, "clientId") : undefined,
      ticketNumber: optionalString(filters.ticketNumber, "ticketNumber") ?? undefined,
      fromDate: optionalDate(filters.fromDate, "fromDate") ?? undefined,
      toDate: optionalDate(filters.toDate, "toDate") ?? undefined,
    };
    return this.repo.findAllWithFilters(validated);
  }

  async listDetailed(filters: PqrsDetailedFilters) {
    const sort =
      filters.sort !== undefined
        ? ensureEnum(filters.sort, "sort", ["recent", "oldest", "ticket"])
        : undefined;

    const validated: PqrsDetailedFilters = {
      pqrsStatusId: optionalPositiveInt(filters.pqrsStatusId, "pqrsStatusId"),
      areaId: optionalPositiveInt(filters.areaId, "areaId"),
      typePqrsId: optionalPositiveInt(filters.typePqrsId, "typePqrsId"),
      clientId:
        filters.clientId !== undefined ? requireBigInt(filters.clientId, "clientId") : undefined,
      ticketNumber: optionalString(filters.ticketNumber, "ticketNumber") ?? undefined,
      fromDate: optionalDate(filters.fromDate, "fromDate") ?? undefined,
      toDate: optionalDate(filters.toDate, "toDate") ?? undefined,
      q: optionalString(filters.q, "q") ?? undefined,
      sort,
    };

    return this.repo.findAllDetailed(validated);
  }

  async listSeguimientoDetailed() {
    return this.repo.findSeguimientoDetailed();
  }

  async listApelacionesDetailed() {
    return this.repo.findApelacionesDetailed();
  }

  async listCerradasDetailed() {
    return this.repo.findCerradasDetailed();
  }

  async findByTicketNumber(ticketNumber: string): Promise<IPqrs> {
    const code = requireString(ticketNumber, "ticketNumber");
    const pqrs = await this.repo.findByTicketNumber(code);
    return ensureFound("PQRS", pqrs, { ticketNumber: code });
  }

  async findDetailedByTicketNumber(ticketNumber: string): Promise<PqrsDetailedView> {
    const code = requireString(ticketNumber, "ticketNumber");
    const pqrs = await this.repo.findDetailedByTicketNumber(code);
    return ensureFound("PQRS", pqrs, { ticketNumber: code });
  }

  async findBotResponseByTicketNumber(ticketNumber: string): Promise<PqrsBotResponseView> {
    const code = requireString(ticketNumber, "ticketNumber");
    const pqrs = await this.repo.findBotResponseByTicketNumber(code);
    return ensureFound("PQRS", pqrs, { ticketNumber: code });
  }

  async findBotResponseByPqrsId(pqrsId: number): Promise<PqrsBotResponseView> {
    const id = requirePositiveInt(pqrsId, "pqrsId");
    const pqrs = await this.repo.findBotResponseByPqrsId(id);
    return ensureFound("PQRS", pqrs, { pqrsId: id });
  }

  async update(data: UpdatePqrsDTO): Promise<IPqrs> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, [
      "ticketNumber",
      "isAutoResolved",
      "dueDate",
      "pqrsStatusId",
      "clientId",
      "typePqrsId",
      "areaId",
      "appeal",
    ], "PQRS");

    const current = await this.findById(id);

    if (data.ticketNumber !== undefined) {
      const ticketNumber = requireString(data.ticketNumber, "ticketNumber");
      const existing = await this.repo.findByTicketNumber(ticketNumber);
      if (existing && existing.id !== id) {
        throw new AppError(
          "Ticket number already exists",
          409,
          "CONFLICT",
          { ticketNumber }
        );
      }
    }

    const isAutoResolved =
      optionalBoolean(data.isAutoResolved, "isAutoResolved") ?? current.isAutoResolved;

    if (data.pqrsStatusId !== undefined) {
      const next = requirePositiveInt(data.pqrsStatusId, "pqrsStatusId");
      this.validateTransition(current.pqrsStatusId, next, isAutoResolved);
    }

    if (data.clientId !== undefined) {
      const clientId = requireBigInt(data.clientId, "clientId");
      ensureFound(
        "Client",
        await this.clienteRepo.findById(clientId),
        { clientId }
      );
    }
    if (data.typePqrsId !== undefined) {
      const typePqrsId = requirePositiveInt(data.typePqrsId, "typePqrsId");
      ensureFound(
        "TypePqrs",
        await this.tipoPqrsRepo.findById(typePqrsId),
        { typePqrsId }
      );
    }
    if (data.areaId !== undefined) {
      const areaId = requirePositiveInt(data.areaId, "areaId");
      ensureFound(
        "Area",
        await this.areaRepo.findById(areaId),
        { areaId }
      );
    }

    const shouldTouchUpdatedAt = data.pqrsStatusId !== undefined;
    const updated = await this.repo.update({
      ...data,
      id,
      isAutoResolved,
      updatedAt:
        shouldTouchUpdatedAt && data.updatedAt === undefined ? new Date() : data.updatedAt,
      dueDate:
        data.dueDate !== undefined
          ? data.dueDate === null
            ? null
            : requireDate(data.dueDate, "dueDate")
          : undefined,
      appeal:
        data.appeal !== undefined ? optionalString(data.appeal, "appeal") ?? null : undefined,
    });

    const ensured = ensureFound("PQRS", updated, { id });
    if (data.pqrsStatusId !== undefined && data.pqrsStatusId !== current.pqrsStatusId) {
      await this.statusHistoryService.logStatusChange(ensured.id, ensured.pqrsStatusId);
    }
    return ensured;
  }

  async delete(data: DeletePqrsDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }

  async finalize(id: number): Promise<IPqrs> {
    const pqrs = await this.findById(requirePositiveInt(id, "id"));
    this.validateTransition(pqrs.pqrsStatusId, PQRS_STATUS.CERRADO, pqrs.isAutoResolved);
    const updated = await this.repo.update({
      id: pqrs.id,
      pqrsStatusId: PQRS_STATUS.CERRADO,
      updatedAt: new Date(),
    });
    const ensured = ensureFound("PQRS", updated, { id: pqrs.id });
    await this.statusHistoryService.logStatusChange(ensured.id, ensured.pqrsStatusId);
    return ensured;
  }

  async appeal(id: number, appeal?: string | null): Promise<IPqrs> {
    const pqrs = await this.findById(requirePositiveInt(id, "id"));
    let nextStatus: PqrsStatusId = PQRS_STATUS.REANALISIS;
    if (pqrs.pqrsStatusId === PQRS_STATUS.REANALISIS) {
      nextStatus = PQRS_STATUS.DEVUELTO;
    } else if (pqrs.pqrsStatusId === PQRS_STATUS.DEVUELTO) {
      nextStatus = PQRS_STATUS.REANALISIS;
    }
    this.validateTransition(pqrs.pqrsStatusId, nextStatus, pqrs.isAutoResolved);
    const updated = await this.repo.update({
      id: pqrs.id,
      pqrsStatusId: nextStatus,
      updatedAt: new Date(),
      appeal: appeal !== undefined ? optionalString(appeal, "appeal") ?? null : undefined,
    });
    const ensured = ensureFound("PQRS", updated, { id: pqrs.id });
    await this.statusHistoryService.logStatusChange(
      ensured.id,
      ensured.pqrsStatusId,
      appeal ? String(appeal) : undefined
    );
    return ensured;
  }
}
