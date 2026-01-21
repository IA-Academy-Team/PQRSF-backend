import { CreateResponsableDTO, DeleteResponsableDTO, UpdateResponsableDTO } from "../DTOs/responsable.dto";
import { IResponsable } from "../models/responsable.model";
import { ResponsableRepository } from "../repositories/responsable.repository";
import { AreaRepository } from "../repositories/area.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalEmail,
  requireEmail,
  requirePositiveInt,
  requireString,
} from "../utils/validation.utils";

export class ResponsableService {
  constructor(
    private readonly repo = new ResponsableRepository(),
    private readonly areaRepo = new AreaRepository()
  ) {}

  async create(data: CreateResponsableDTO): Promise<IResponsable> {
    const name = requireString(data.name, "name");
    const email = requireEmail(data.email, "email");
    const password = requireString(data.password, "password");
    const phoneNumber = requireString(data.phoneNumber, "phoneNumber");
    const areaId =
      data.areaId === undefined || data.areaId === null
        ? null
        : requirePositiveInt(data.areaId, "areaId");

    const existing = await this.repo.findByEmail(email);
    if (existing) {
      throw new AppError("Email already exists", 409, "CONFLICT", { email });
    }

    if (areaId) {
      ensureFound("Area", await this.areaRepo.findById(areaId), { areaId });
    }

    return this.repo.create({ name, email, password, phoneNumber, areaId });
  }

  async findById(id: number): Promise<IResponsable> {
    const responsable = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Responsable", responsable, { id });
  }

  async update(data: UpdateResponsableDTO): Promise<IResponsable> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(
      data as Record<string, unknown>,
      ["name", "email", "password", "phoneNumber", "areaId"],
      "Responsable"
    );

    if (data.email !== undefined) {
      const email = requireEmail(data.email, "email");
      const existing = await this.repo.findByEmail(email);
      if (existing && existing.id !== id) {
        throw new AppError("Email already exists", 409, "CONFLICT", { email });
      }
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
      name:
        data.name !== undefined
          ? data.name === null
            ? undefined
            : requireString(data.name, "name")
          : undefined,
      email: data.email !== undefined ? requireEmail(data.email, "email") : undefined,
      password:
        data.password !== undefined
          ? data.password === null
            ? undefined
            : requireString(data.password, "password")
          : undefined,
      phoneNumber:
        data.phoneNumber !== undefined
          ? data.phoneNumber === null
            ? undefined
            : requireString(data.phoneNumber, "phoneNumber")
          : undefined,
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
