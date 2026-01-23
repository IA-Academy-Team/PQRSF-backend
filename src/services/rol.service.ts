import { CreateRolDTO, DeleteRolDTO, UpdateRolDTO } from "../schemas/rol.schema";
import { IRol } from "../models/rol.model";
import { RolRepository } from "../repositories/rol.repository";
import { AppError } from "../middlewares/error.middleware";
import { ensureFound, ensureUpdates, optionalString, requireString, requirePositiveInt } from "../utils/validation.utils";

export class RolService {
  constructor(private readonly repo = new RolRepository()) {}

  async create(data: CreateRolDTO): Promise<IRol> {
    const name = requireString(data.name, "name");
    const description = optionalString(data.description, "description") ?? null;

    const existing = await this.repo.findByName(name);
    if (existing) {
      throw new AppError("Role already exists", 409, "CONFLICT", { name });
    }

    return this.repo.create({ name, description });
  }

  async findById(id: number): Promise<IRol> {
    const role = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Role", role, { id });
  }

  async list(): Promise<IRol[]> {
    return this.repo.findAll();
  }

  async update(data: UpdateRolDTO): Promise<IRol> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["name", "description"], "Role");

    if (data.name !== undefined) {
      const name = requireString(data.name, "name");
      const existing = await this.repo.findByName(name);
      if (existing && existing.id !== id) {
        throw new AppError("Role already exists", 409, "CONFLICT", { name });
      }
    }

    const updated = await this.repo.update({
      id,
      name: data.name !== undefined ? requireString(data.name, "name") : undefined,
      description: data.description !== undefined ? optionalString(data.description, "description") : undefined,
    });

    return ensureFound("Role", updated, { id });
  }

  async delete(data: DeleteRolDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
