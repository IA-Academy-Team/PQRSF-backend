import { CreateStakeholderDTO, DeleteStakeholderDTO, UpdateStakeholderDTO } from "../schemas/stakeholder.schema";
import { IStakeholder } from "../models/stakeholder.model";
import { StakeholderRepository } from "../repositories/stakeholder.repository";
import { AppError } from "../middlewares/error.middleware";
import { ensureFound, ensureUpdates, requirePositiveInt, requireString } from "../utils/validation.utils";

export class StakeholderService {
  constructor(private readonly repo = new StakeholderRepository()) {}

  async create(data: CreateStakeholderDTO): Promise<IStakeholder> {
    const name = requireString(data.name, "name");
    const existing = await this.repo.findAll();
    if (existing.some((item) => item.name === name)) {
      throw new AppError("Stakeholder already exists", 409, "CONFLICT", { name });
    }
    return this.repo.create({ name });
  }

  async findById(id: number): Promise<IStakeholder> {
    const stakeholder = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Stakeholder", stakeholder, { id });
  }

  async list(): Promise<IStakeholder[]> {
    return this.repo.findAll();
  }

  async update(data: UpdateStakeholderDTO): Promise<IStakeholder> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["name"], "Stakeholder");

    if (data.name !== undefined) {
      const name = requireString(data.name, "name");
      const existing = await this.repo.findAll();
      const conflict = existing.find((item) => item.name === name);
      if (conflict && conflict.id !== id) {
        throw new AppError("Stakeholder already exists", 409, "CONFLICT", { name });
      }
    }

    const updated = await this.repo.update({
      id,
      name: data.name !== undefined ? requireString(data.name, "name") : undefined,
    });
    return ensureFound("Stakeholder", updated, { id });
  }

  async delete(data: DeleteStakeholderDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
