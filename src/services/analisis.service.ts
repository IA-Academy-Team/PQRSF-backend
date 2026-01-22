import { CreateAnalisisDTO, DeleteAnalisisDTO, UpdateAnalisisDTO } from "../schemas/analisis.schema";
import { IAnalisis } from "../models/analisis.model";
import { AnalisisRepository } from "../repositories/analisis.repository";
import { PqrsRepository } from "../repositories/pqrs.repository";
import { ResponsableRepository } from "../repositories/responsable.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  requirePositiveInt,
  optionalString,
} from "../utils/validation.utils";

const PQRS_STATUS = {
  RADICADO: 1,
  ANALISIS: 2,
  REANALISIS: 3,
  CERRADO: 4,
} as const;

export class AnalisisService {
  constructor(
    private readonly repo = new AnalisisRepository(),
    private readonly pqrsRepo = new PqrsRepository(),
    private readonly responsableRepo = new ResponsableRepository()
  ) {}

  async create(data: CreateAnalisisDTO): Promise<IAnalisis> {
    const pqrsId = requirePositiveInt(data.pqrsId, "pqrsId");
    const responsibleId = requirePositiveInt(data.responsibleId, "responsibleId");
    const answer = optionalString(data.answer, "answer") ?? null;
    const actionTaken = optionalString(data.actionTaken, "actionTaken") ?? null;

    const pqrs = ensureFound("PQRS", await this.pqrsRepo.findById(pqrsId), {
      pqrsId,
    });
    if (pqrs.pqrsStatusId !== PQRS_STATUS.RADICADO) {
      throw new AppError(
        "PQRS must be in Radicado to create analysis",
        409,
        "BUSINESS_RULE_VIOLATION",
        { pqrsId, status: pqrs.pqrsStatusId }
      );
    }

    const responsable = ensureFound(
      "Responsable",
      await this.responsableRepo.findById(responsibleId),
      { responsibleId }
    );
    if (responsable.areaId !== pqrs.areaId) {
      throw new AppError(
        "Responsable does not belong to PQRS area",
        403,
        "FORBIDDEN",
        { pqrsId, responsibleId, areaId: pqrs.areaId }
      );
    }

    const existing = await this.repo.findByPqrsId(pqrsId);
    if (existing) {
      throw new AppError(
        "Analysis already exists for this PQRS",
        409,
        "CONFLICT",
        { pqrsId }
      );
    }

    const analysis = await this.repo.create({
      pqrsId,
      responsibleId,
      answer,
      actionTaken,
    });

    await this.pqrsRepo.update({
      id: pqrsId,
      pqrsStatusId: PQRS_STATUS.ANALISIS,
    });

    return analysis;
  }

  async findById(id: number): Promise<IAnalisis> {
    const analysis = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Analysis", analysis, { id });
  }

  async update(data: UpdateAnalisisDTO): Promise<IAnalisis> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["answer", "actionTaken"], "Analysis");

    const existing = await this.findById(id);
    const pqrs = ensureFound("PQRS", await this.pqrsRepo.findById(existing.pqrsId), {
      pqrsId: existing.pqrsId,
    });
    if (pqrs.pqrsStatusId === PQRS_STATUS.CERRADO) {
      throw new AppError(
        "Cannot update analysis when PQRS is closed",
        409,
        "BUSINESS_RULE_VIOLATION",
        { pqrsId: pqrs.id }
      );
    }

    const updated = await this.repo.update({
      id,
      answer: data.answer !== undefined ? optionalString(data.answer, "answer") : undefined,
      actionTaken:
        data.actionTaken !== undefined
          ? optionalString(data.actionTaken, "actionTaken")
          : undefined,
    });

    return ensureFound("Analysis", updated, { id });
  }

  async delete(data: DeleteAnalisisDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
