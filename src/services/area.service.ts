import { CreateAreaDTO, DeleteAreaDTO, UpdateAreaDTO } from "../schemas/area.schema";
import { IArea } from "../models/area.model";
import { AreaRepository } from "../repositories/area.repository";
import { AppError } from "../middlewares/error.middleware";
import { ensureFound, ensureUpdates, optionalString, requirePositiveInt, requireString } from "../utils/validation.utils";

export class AreaService {
  constructor(private readonly repo = new AreaRepository()) {}

  async create(data: CreateAreaDTO): Promise<IArea> {
    const name = requireString(data.name, "name");
    const code = optionalString(data.code, "code") ?? null;

    const existing = await this.repo.findAll();
    if (existing.some((item) => item.name === name)) {
      throw new AppError("Area already exists", 409, "CONFLICT", { name });
    }
    if (code && existing.some((item) => item.code === code)) {
      throw new AppError("Area code already exists", 409, "CONFLICT", { code });
    }

    return this.repo.create({ name, code });
  }

  async findById(id: number): Promise<IArea> {
    const area = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Area", area, { id });
  }

  async list(): Promise<IArea[]> {
    return this.repo.findAll();
  }

  async update(data: UpdateAreaDTO): Promise<IArea> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["name", "code"], "Area");

    if (data.name !== undefined) {
      const name = requireString(data.name, "name");
      const existing = await this.repo.findAll();
      const conflict = existing.find((item) => item.name === name);
      if (conflict && conflict.id !== id) {
        throw new AppError("Area already exists", 409, "CONFLICT", { name });
      }
    }

    if (data.code !== undefined && data.code !== null) {
      const code = optionalString(data.code, "code");
      if (code) {
        const existing = await this.repo.findAll();
        const conflict = existing.find((item) => item.code === code);
        if (conflict && conflict.id !== id) {
          throw new AppError("Area code already exists", 409, "CONFLICT", { code });
        }
      }
    }

    const updated = await this.repo.update({
      id,
      name: data.name !== undefined ? requireString(data.name, "name") : undefined,
      code: data.code !== undefined ? optionalString(data.code, "code") ?? null : undefined,
    });
    return ensureFound("Area", updated, { id });
  }

  async delete(data: DeleteAreaDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
