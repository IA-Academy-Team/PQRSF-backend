import { CreateVerificacionDTO, DeleteVerificacionDTO, UpdateVerificacionDTO } from "../schemas/verificacion.schema";
import { IVerificacion } from "../models/verificacion.model";
import { VerificacionRepository } from "../repositories/verificacion.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalDate,
  optionalString,
  requireDate,
  requirePositiveInt,
  requireString,
} from "../utils/validation.utils";

export class VerificacionService {
  constructor(private readonly repo = new VerificacionRepository()) {}

  async create(data: CreateVerificacionDTO): Promise<IVerificacion> {
    const identifier = requireString(data.identifier, "identifier");
    const value = requireString(data.value, "value");
    const expiresAt = optionalDate(data.expiresAt, "expiresAt");
    if (!expiresAt) {
      throw new AppError("expiresAt is required", 400, "VALIDATION_ERROR");
    }

    const existing = await this.repo.findByIdentifierAndValue(identifier, value);
    if (existing) {
      throw new AppError(
        "Verification already exists",
        409,
        "CONFLICT",
        { identifier, value }
      );
    }

    return this.repo.create({ identifier, value, expiresAt });
  }

  async findById(id: number): Promise<IVerificacion> {
    const verification = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Verification", verification, { id });
  }

  async update(data: UpdateVerificacionDTO): Promise<IVerificacion> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["identifier", "value", "expiresAt"], "Verification");

    const updated = await this.repo.update({
      id,
      identifier:
        data.identifier !== undefined ? requireString(data.identifier, "identifier") : undefined,
      value: data.value !== undefined ? requireString(data.value, "value") : undefined,
      expiresAt:
        data.expiresAt !== undefined
          ? data.expiresAt === null
            ? undefined
            : requireDate(data.expiresAt, "expiresAt")
          : undefined,
    });
    return ensureFound("Verification", updated, { id });
  }

  async delete(data: DeleteVerificacionDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
