import { CreateReanalisisDTO, DeleteReanalisisDTO, UpdateReanalisisDTO } from "../schemas/reanalisis.schema";
import { IReanalisis } from "../models/reanalisis.model";
import { ReanalisisRepository } from "../repositories/reanalisis.repository";
import { AnalisisRepository } from "../repositories/analisis.repository";
import { PqrsRepository } from "../repositories/pqrs.repository";
import { ResponsableRepository } from "../repositories/responsable.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalString,
  requirePositiveInt,
} from "../utils/validation.utils";

const PQRS_STATUS = {
  RADICADO: 1,
  ANALISIS: 2,
  REANALISIS: 3,
  CERRADO: 4,
} as const;

export class ReanalisisService {
  constructor(
    private readonly repo = new ReanalisisRepository(),
    private readonly analisisRepo = new AnalisisRepository(),
    private readonly pqrsRepo = new PqrsRepository(),
    private readonly responsableRepo = new ResponsableRepository()
  ) {}

  async create(data: CreateReanalisisDTO): Promise<IReanalisis> {
    const analysisId = requirePositiveInt(data.analysisId, "analysisId");
    const responsibleId = requirePositiveInt(data.responsibleId, "responsibleId");
    const answer = optionalString(data.answer, "answer") ?? null;
    const actionTaken = optionalString(data.actionTaken, "actionTaken") ?? null;

    const analysis = ensureFound(
      "Analysis",
      await this.analisisRepo.findById(analysisId),
      { analysisId }
    );

    const pqrs = ensureFound(
      "PQRS",
      await this.pqrsRepo.findById(analysis.pqrsId),
      { pqrsId: analysis.pqrsId }
    );
    if (pqrs.pqrsStatusId !== PQRS_STATUS.REANALISIS) {
      throw new AppError(
        "PQRS must be in Reanalisis to create a reanalysis",
        409,
        "BUSINESS_RULE_VIOLATION",
        { pqrsId: pqrs.id, status: pqrs.pqrsStatusId }
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
        { pqrsId: pqrs.id, responsibleId, areaId: pqrs.areaId }
      );
    }

    const existing = await this.repo.findByAnalysisId(analysisId);
    if (existing) {
      throw new AppError(
        "Reanalysis already exists for this analysis",
        409,
        "CONFLICT",
        { analysisId }
      );
    }

    return this.repo.create({
      analysisId,
      responsibleId,
      answer,
      actionTaken,
    });
  }

  async findById(id: number): Promise<IReanalisis> {
    const reanalysis = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Reanalysis", reanalysis, { id });
  }

  async update(data: UpdateReanalisisDTO): Promise<IReanalisis> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(
      data as Record<string, unknown>,
      ["answer", "actionTaken"],
      "Reanalysis"
    );

    const existing = await this.findById(id);
    const analysis = ensureFound(
      "Analysis",
      await this.analisisRepo.findById(existing.analysisId),
      { analysisId: existing.analysisId }
    );
    const pqrs = ensureFound(
      "PQRS",
      await this.pqrsRepo.findById(analysis.pqrsId),
      { pqrsId: analysis.pqrsId }
    );
    if (pqrs.pqrsStatusId === PQRS_STATUS.CERRADO) {
      throw new AppError(
        "Cannot update reanalysis when PQRS is closed",
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
    return ensureFound("Reanalysis", updated, { id });
  }

  async delete(data: DeleteReanalisisDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
