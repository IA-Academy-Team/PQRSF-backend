import { CreateSesionDTO, DeleteSesionDTO, UpdateSesionDTO } from "../DTOs/sesion.dto";
import { ISesion } from "../models/sesion.model";
import { SesionRepository } from "../repositories/sesion.repository";
import { UsuarioRepository } from "../repositories/usuario.repository";
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

export class SesionService {
  constructor(
    private readonly repo = new SesionRepository(),
    private readonly usuarioRepo = new UsuarioRepository()
  ) {}

  async create(data: CreateSesionDTO): Promise<ISesion> {
    const token = requireString(data.token, "token");
    const expiresAt = optionalDate(data.expiresAt, "expiresAt");
    if (!expiresAt) {
      throw new AppError("expiresAt is required", 400, "VALIDATION_ERROR");
    }
    const userId = requirePositiveInt(data.userId, "userId");

    ensureFound("User", await this.usuarioRepo.findById(userId), { userId });
    const existing = await this.repo.findByToken(token);
    if (existing) {
      throw new AppError("Token already exists", 409, "CONFLICT", { token });
    }

    return this.repo.create({
      token,
      expiresAt,
      ipAddress: optionalString(data.ipAddress, "ipAddress") ?? null,
      userAgent: optionalString(data.userAgent, "userAgent") ?? null,
      userId,
    });
  }

  async findById(id: number): Promise<ISesion> {
    const session = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Session", session, { id });
  }

  async update(data: UpdateSesionDTO): Promise<ISesion> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(
      data as Record<string, unknown>,
      ["token", "expiresAt", "ipAddress", "userAgent", "userId"],
      "Session"
    );

    if (data.token !== undefined) {
      const token = requireString(data.token, "token");
      const existing = await this.repo.findByToken(token);
      if (existing && existing.id !== id) {
        throw new AppError("Token already exists", 409, "CONFLICT", { token });
      }
    }

    if (data.userId !== undefined) {
      const userId = requirePositiveInt(data.userId, "userId");
      ensureFound("User", await this.usuarioRepo.findById(userId), { userId });
    }

    const updated = await this.repo.update({
      id,
      token: data.token !== undefined ? requireString(data.token, "token") : undefined,
      expiresAt:
        data.expiresAt !== undefined
          ? data.expiresAt === null
            ? undefined
            : requireDate(data.expiresAt, "expiresAt")
          : undefined,
      ipAddress: data.ipAddress !== undefined ? optionalString(data.ipAddress, "ipAddress") : undefined,
      userAgent: data.userAgent !== undefined ? optionalString(data.userAgent, "userAgent") : undefined,
      userId: data.userId !== undefined ? requirePositiveInt(data.userId, "userId") : undefined,
    });
    return ensureFound("Session", updated, { id });
  }

  async delete(data: DeleteSesionDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
