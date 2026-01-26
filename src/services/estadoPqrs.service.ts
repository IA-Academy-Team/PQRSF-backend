import { CreateEstadoPqrsDTO, DeleteEstadoPqrsDTO, UpdateEstadoPqrsDTO } from "../schemas/estadoPqrs.schema";
import { IEstadoPqrs } from "../models/estado.model";
import { EstadoPqrsRepository } from "../repositories/estadoPqrs.repository";
import { AppError } from "../middlewares/error.middleware";
import { ensureFound, ensureUpdates, requirePositiveInt, requireString } from "../utils/validation.utils";

export class EstadoPqrsService {
  constructor(private readonly repo = new EstadoPqrsRepository()) {}

  async create(data: CreateEstadoPqrsDTO): Promise<IEstadoPqrs> {
    const name = requireString(data.name, "name");
    const existing = await this.repo.findAll();
    if (existing.some((item) => item.name === name)) {
      throw new AppError("PQRS status already exists", 409, "CONFLICT", { name });
    }
    return this.repo.create({ name });
  }

  async findById(id: number): Promise<IEstadoPqrs> {
    const status = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("PqrsStatus", status, { id });
  }

  async list(): Promise<IEstadoPqrs[]> {
    return this.repo.findAll();
  }

  async update(data: UpdateEstadoPqrsDTO): Promise<IEstadoPqrs> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["name"], "PqrsStatus");

    if (data.name !== undefined) {
      const name = requireString(data.name, "name");
      const existing = await this.repo.findAll();
      const conflict = existing.find((item) => item.name === name);
      if (conflict && conflict.id !== id) {
        throw new AppError("PQRS status already exists", 409, "CONFLICT", { name });
      }
    }

    const updated = await this.repo.update({
      id,
      name: data.name !== undefined ? requireString(data.name, "name") : undefined,
    });
    return ensureFound("PqrsStatus", updated, { id });
  }

  async delete(data: DeleteEstadoPqrsDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
