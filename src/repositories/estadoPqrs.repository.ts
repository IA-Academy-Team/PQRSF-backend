import prisma from "../config/db.config";
import { IEstadoPqrs } from "../models/estado.model";
import { CreateEstadoPqrsDTO, UpdateEstadoPqrsDTO, DeleteEstadoPqrsDTO } from "../schemas/estadoPqrs.schema";

export class EstadoPqrsRepository {
  private readonly table = "pqrs_status";

  async create(data: CreateEstadoPqrsDTO): Promise<IEstadoPqrs> {
    return prisma.pqrsStatus.create({
      data: { name: data.name },
      select: { id: true, name: true },
    });
  }

  async findById(id: number): Promise<IEstadoPqrs | null> {
    return prisma.pqrsStatus.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  async findAll(): Promise<IEstadoPqrs[]> {
    return prisma.pqrsStatus.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
  }

  async update(data: UpdateEstadoPqrsDTO): Promise<IEstadoPqrs | null> {
    if (data.name === undefined) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.pqrsStatus.updateMany({
      where: { id: data.id as number },
      data: { name: data.name },
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteEstadoPqrsDTO): Promise<boolean> {
    const deleted = await prisma.pqrsStatus.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
