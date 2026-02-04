import prisma from "../config/db.config";
import { ITipoPersona } from "../models/tipoPersona.model";
import { CreateTipoPersonaDTO, UpdateTipoPersonaDTO, DeleteTipoPersonaDTO } from "../schemas/tipoPersona.schema";

export class TipoPersonaRepository {
  private readonly table = "type_person";

  async create(data: CreateTipoPersonaDTO): Promise<ITipoPersona> {
    return prisma.typePerson.create({
      data: { name: data.name },
      select: { id: true, name: true },
    });
  }

  async findById(id: number): Promise<ITipoPersona | null> {
    return prisma.typePerson.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  async findAll(): Promise<ITipoPersona[]> {
    return prisma.typePerson.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
  }

  async update(data: UpdateTipoPersonaDTO): Promise<ITipoPersona | null> {
    if (data.name === undefined) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.typePerson.updateMany({
      where: { id: data.id as number },
      data: { name: data.name },
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteTipoPersonaDTO): Promise<boolean> {
    const deleted = await prisma.typePerson.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
