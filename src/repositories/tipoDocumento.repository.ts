import prisma from "../config/db.config";
import { ITipoDocumento } from "../models/tipoDocumento.model";
import { CreateTipoDocumentoDTO, UpdateTipoDocumentoDTO, DeleteTipoDocumentoDTO } from "../schemas/tipoDocumento.schema";

export class TipoDocumentoRepository {
  private readonly table = "type_document";

  async create(data: CreateTipoDocumentoDTO): Promise<ITipoDocumento> {
    return prisma.typeDocument.create({
      data: { name: data.name },
      select: { id: true, name: true },
    });
  }

  async findById(id: number): Promise<ITipoDocumento | null> {
    return prisma.typeDocument.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  async findAll(): Promise<ITipoDocumento[]> {
    return prisma.typeDocument.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
  }

  async update(data: UpdateTipoDocumentoDTO): Promise<ITipoDocumento | null> {
    if (data.name === undefined) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.typeDocument.updateMany({
      where: { id: data.id as number },
      data: { name: data.name },
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteTipoDocumentoDTO): Promise<boolean> {
    const deleted = await prisma.typeDocument.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
