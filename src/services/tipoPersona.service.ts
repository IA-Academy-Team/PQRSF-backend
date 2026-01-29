import { CreateTipoPersonaDTO, DeleteTipoPersonaDTO, UpdateTipoPersonaDTO } from "../schemas/tipoPersona.schema";
import { ITipoPersona } from "../models/tipoPersona.model";
import { TipoPersonaRepository } from "../repositories/tipoPersona.repository";
import { AppError } from "../middlewares/error.middleware";
import { ensureFound, ensureUpdates, requirePositiveInt, requireString } from "../utils/validation.utils";

export class TipoPersonaService {
  constructor(private readonly repo = new TipoPersonaRepository()) {}

  async create(data: CreateTipoPersonaDTO): Promise<ITipoPersona> {
    const name = requireString(data.name, "name");
    const existing = await this.repo.findAll();
    if (existing.some((item) => item.name === name)) {
      throw new AppError("Type person already exists", 409, "CONFLICT", { name });
    }
    return this.repo.create({ name });
  }

  async findById(id: number): Promise<ITipoPersona> {
    const type = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("TypePerson", type, { id });
  }

  async list(): Promise<ITipoPersona[]> {
    return this.repo.findAll();
  }

  async update(data: UpdateTipoPersonaDTO): Promise<ITipoPersona> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["name"], "TypePerson");

    if (data.name !== undefined) {
      const name = requireString(data.name, "name");
      const existing = await this.repo.findAll();
      const conflict = existing.find((item) => item.name === name);
      if (conflict && conflict.id !== id) {
        throw new AppError("Type person already exists", 409, "CONFLICT", { name });
      }
    }

    const updated = await this.repo.update({
      id,
      name: data.name !== undefined ? requireString(data.name, "name") : undefined,
    });
    return ensureFound("TypePerson", updated, { id });
  }

  async delete(data: DeleteTipoPersonaDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
