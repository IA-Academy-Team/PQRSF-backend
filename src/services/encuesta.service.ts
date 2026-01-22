import { CreateEncuestaDTO, DeleteEncuestaDTO, UpdateEncuestaDTO } from "../schemas/encuesta.schema";
import { IEncuesta } from "../models/encuesta.model";
import { EncuestaRepository } from "../repositories/encuesta.repository";
import { PqrsRepository } from "../repositories/pqrs.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalString,
  requirePositiveInt,
} from "../utils/validation.utils";

const PQRS_STATUS = {
  CERRADO: 4,
} as const;

const validateScore = (value: unknown, field: string) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5) {
    throw new AppError(
      `${field} must be an integer between 1 and 5`,
      400,
      "VALIDATION_ERROR",
      { field, value }
    );
  }
  return value;
};

export class EncuestaService {
  constructor(
    private readonly repo = new EncuestaRepository(),
    private readonly pqrsRepo = new PqrsRepository()
  ) {}

  async create(data: CreateEncuestaDTO): Promise<IEncuesta> {
    const pqrsId = requirePositiveInt(data.pqrsId, "pqrsId");
    const pqrs = ensureFound("PQRS", await this.pqrsRepo.findById(pqrsId), { pqrsId });
    if (pqrs.pqrsStatusId !== PQRS_STATUS.CERRADO) {
      throw new AppError(
        "Survey can only be created for closed PQRS",
        409,
        "BUSINESS_RULE_VIOLATION",
        { pqrsId, status: pqrs.pqrsStatusId }
      );
    }

    const existing = await this.repo.findByPqrsId(pqrsId);
    if (existing) {
      throw new AppError(
        "Survey already exists for this PQRS",
        409,
        "CONFLICT",
        { pqrsId }
      );
    }

    return this.repo.create({
      q1Clarity: validateScore(data.q1Clarity, "q1Clarity") ?? null,
      q2Timeliness: validateScore(data.q2Timeliness, "q2Timeliness") ?? null,
      q3Quality: validateScore(data.q3Quality, "q3Quality") ?? null,
      q4Attention: validateScore(data.q4Attention, "q4Attention") ?? null,
      q5Overall: validateScore(data.q5Overall, "q5Overall") ?? null,
      comment: optionalString(data.comment, "comment") ?? null,
      pqrsId,
    });
  }

  async findById(id: number): Promise<IEncuesta> {
    const survey = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Survey", survey, { id });
  }

  async update(data: UpdateEncuestaDTO): Promise<IEncuesta> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(
      data as Record<string, unknown>,
      ["q1Clarity", "q2Timeliness", "q3Quality", "q4Attention", "q5Overall", "comment"],
      "Survey"
    );

    const updated = await this.repo.update({
      id,
      q1Clarity: data.q1Clarity !== undefined ? validateScore(data.q1Clarity, "q1Clarity") : undefined,
      q2Timeliness:
        data.q2Timeliness !== undefined ? validateScore(data.q2Timeliness, "q2Timeliness") : undefined,
      q3Quality: data.q3Quality !== undefined ? validateScore(data.q3Quality, "q3Quality") : undefined,
      q4Attention:
        data.q4Attention !== undefined ? validateScore(data.q4Attention, "q4Attention") : undefined,
      q5Overall: data.q5Overall !== undefined ? validateScore(data.q5Overall, "q5Overall") : undefined,
      comment: data.comment !== undefined ? optionalString(data.comment, "comment") : undefined,
    });
    return ensureFound("Survey", updated, { id });
  }

  async delete(data: DeleteEncuestaDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
