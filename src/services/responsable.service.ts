import { CreateResponsableDTO, DeleteResponsableDTO, UpdateResponsableDTO } from "../schemas/responsable.schema";
import { IResponsable, IResponsableSummary } from "../models/responsable.model";
import { ResponsableRepository } from "../repositories/responsable.repository";
import { AreaRepository } from "../repositories/area.repository";
import { UsuarioRepository } from "../repositories/usuario.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  requirePositiveInt,
} from "../utils/validation.utils";

export class ResponsableService {
  constructor(
    private readonly repo = new ResponsableRepository(),
    private readonly areaRepo = new AreaRepository(),
    private readonly usuarioRepo = new UsuarioRepository()
  ) {}

  async create(data: CreateResponsableDTO): Promise<IResponsable> {
    const userId = requirePositiveInt(data.userId, "userId");
    const areaId =
      data.areaId === undefined || data.areaId === null
        ? null
        : requirePositiveInt(data.areaId, "areaId");

    const existing = await this.repo.findByUserId(userId);
    if (existing) {
      throw new AppError(
        "Responsable already exists for user",
        409,
        "CONFLICT",
        { userId }
      );
    }

    ensureFound("User", await this.usuarioRepo.findById(userId), { userId });
    if (areaId) {
      ensureFound("Area", await this.areaRepo.findById(areaId), { areaId });
    }

    return this.repo.create({
      userId,
      areaId,
    });
  }

  async findById(id: number): Promise<IResponsable> {
    const responsable = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Responsable", responsable, { id });
  }

  async findByUserId(userId: number): Promise<IResponsable> {
    const id = requirePositiveInt(userId, "userId");
    const responsable = await this.repo.findByUserId(id);
    return ensureFound("Responsable", responsable, { userId: id });
  }

  async findAll(): Promise<IResponsable[]> {
    return this.repo.findAll();
  }

  async findAllDetailed(): Promise<IResponsableSummary[]> {
    return this.repo.findAllDetailed();
  }

  async findByAreaId(areaId: number): Promise<IResponsable[]> {
    const id = requirePositiveInt(areaId, "areaId");
    ensureFound("Area", await this.areaRepo.findById(id), { areaId: id });
    return this.repo.findByAreaId(id);
  }

  async update(data: UpdateResponsableDTO): Promise<IResponsable> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(
      data as Record<string, unknown>,
      ["userId", "areaId"],
      "Responsable"
    );

    if (data.userId !== undefined) {
      const userId = requirePositiveInt(data.userId, "userId");
      const existing = await this.repo.findByUserId(userId);
      if (existing && existing.id !== id) {
        throw new AppError(
          "Responsable already exists for user",
          409,
          "CONFLICT",
          { userId }
        );
      }
      ensureFound("User", await this.usuarioRepo.findById(userId), { userId });
    }

    if (data.areaId !== undefined) {
      const areaId =
        data.areaId === null ? null : requirePositiveInt(data.areaId, "areaId");
      if (areaId) {
        ensureFound("Area", await this.areaRepo.findById(areaId), { areaId });
      }
    }

    const updated = await this.repo.update({
      id,
      userId: data.userId !== undefined ? requirePositiveInt(data.userId, "userId") : undefined,
      areaId:
        data.areaId !== undefined
          ? data.areaId === null
            ? null
            : requirePositiveInt(data.areaId, "areaId")
          : undefined,
    });
    return ensureFound("Responsable", updated, { id });
  }

  async delete(data: DeleteResponsableDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
