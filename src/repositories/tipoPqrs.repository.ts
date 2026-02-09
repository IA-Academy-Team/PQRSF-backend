import prisma from "../config/db.config";
import { ITipoPqrs } from "../models/tipoPqrs.model";
import { CreateTipoPqrsDTO, UpdateTipoPqrsDTO, DeleteTipoPqrsDTO } from "../schemas/tipoPqrs.schema";

export class TipoPqrsRepository {
  private readonly table = "type_pqrs";

  async create(data: CreateTipoPqrsDTO): Promise<ITipoPqrs> {
    return prisma.typePqrs.create({
      data: { name: data.name },
      select: { id: true, name: true },
    });
  }

  async findById(id: number): Promise<ITipoPqrs | null> {
    return prisma.typePqrs.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  async findAll(): Promise<ITipoPqrs[]> {
    return prisma.typePqrs.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
  }

  async update(data: UpdateTipoPqrsDTO): Promise<ITipoPqrs | null> {
    if (data.name === undefined) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.typePqrs.updateMany({
      where: { id: data.id as number },
      data: { name: data.name },
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteTipoPqrsDTO): Promise<boolean> {
    const deleted = await prisma.typePqrs.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
