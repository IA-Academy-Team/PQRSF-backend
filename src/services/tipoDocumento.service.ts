import { CreateTipoDocumentoDTO, DeleteTipoDocumentoDTO, UpdateTipoDocumentoDTO } from "../schemas/tipoDocumento.schema";
import { ITipoDocumento } from "../models/tipoDocumento.model";
import { TipoDocumentoRepository } from "../repositories/tipoDocumento.repository";
import { AppError } from "../middlewares/error.middleware";
import { ensureFound, ensureUpdates, requirePositiveInt, requireString } from "../utils/validation.utils";

export class TipoDocumentoService {
  constructor(private readonly repo = new TipoDocumentoRepository()) {}

  async create(data: CreateTipoDocumentoDTO): Promise<ITipoDocumento> {
    const name = requireString(data.name, "name");
    const existing = await this.repo.findAll();
    if (existing.some((item) => item.name === name)) {
      throw new AppError("Type document already exists", 409, "CONFLICT", { name });
    }
    return this.repo.create({ name });
  }

  async findById(id: number): Promise<ITipoDocumento> {
    const type = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("TypeDocument", type, { id });
  }

  async list(): Promise<ITipoDocumento[]> {
    return this.repo.findAll();
  }

  async update(data: UpdateTipoDocumentoDTO): Promise<ITipoDocumento> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(data as Record<string, unknown>, ["name"], "TypeDocument");

    if (data.name !== undefined) {
      const name = requireString(data.name, "name");
      const existing = await this.repo.findAll();
      const conflict = existing.find((item) => item.name === name);
      if (conflict && conflict.id !== id) {
        throw new AppError("Type document already exists", 409, "CONFLICT", { name });
      }
    }

    const updated = await this.repo.update({
      id,
      name: data.name !== undefined ? requireString(data.name, "name") : undefined,
    });
    return ensureFound("TypeDocument", updated, { id });
  }

  async delete(data: DeleteTipoDocumentoDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
