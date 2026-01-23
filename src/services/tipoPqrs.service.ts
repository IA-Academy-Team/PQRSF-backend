import { CreateTipoPqrsDTO, DeleteTipoPqrsDTO, UpdateTipoPqrsDTO } from "../schemas/tipoPqrs.schema";
import { ITipoPqrs } from "../models/tipoPqrs.model";
import { TipoPqrsRepository } from "../repositories/tipoPqrs.repository";
import { AppError } from "../middlewares/error.middleware";
import { ensureFound, ensureUpdates, requirePositiveInt, requireString } from "../utils/validation.utils";

export class TipoPqrsService {
  constructor(private readonly repo = new TipoPqrsRepository()) {}

  async create(data: CreateTipoPqrsDTO): Promise<ITipoPqrs> {
    const name = requireString(data.name, "name");
    const existing = await this.repo.findAll();
    if (existing.some((item) => item.name === name)) {
      throw new AppError("Type PQRS already exists", 409, "CONFLICT", { name });
    }
    return this.repo.create({ name });
  }

  async findById(id: number): Promise<ITipoPqrs> {
    const type = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("TypePqrs", type, { id });
  }

  async list(): Promise<ITipoPqrs[]> {
    return this.repo.findAll();
  }

  async update(data: UpdateTipoPqrsDTO): Promise<ITipoPqrs> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["name"], "TypePqrs");

    if (data.name !== undefined) {
      const name = requireString(data.name, "name");
      const existing = await this.repo.findAll();
      const conflict = existing.find((item) => item.name === name);
      if (conflict && conflict.id !== id) {
        throw new AppError("Type PQRS already exists", 409, "CONFLICT", { name });
      }
    }

    const updated = await this.repo.update({
      id,
      name: data.name !== undefined ? requireString(data.name, "name") : undefined,
    });
    return ensureFound("TypePqrs", updated, { id });
  }

  async delete(data: DeleteTipoPqrsDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
