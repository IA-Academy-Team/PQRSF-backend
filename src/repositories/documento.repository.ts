import prisma from "../config/db.config";
import { IDocumento } from "../models/documento.model";
import { CreateDocumentoDTO, UpdateDocumentoDTO, DeleteDocumentoDTO } from "../schemas/documento.schema";

const documentSelect = {
  id: true,
  url: true,
  typeDocumentId: true,
  pqrsId: true,
} as const;

export class DocumentoRepository {
  private readonly table = "document";

  async create(data: CreateDocumentoDTO): Promise<IDocumento> {
    return prisma.document.create({
      data: {
        url: data.url,
        typeDocumentId: data.typeDocumentId,
        pqrsId: data.pqrsId,
      },
      select: documentSelect,
    });
  }

  async findById(id: number): Promise<IDocumento | null> {
    return prisma.document.findUnique({
      where: { id },
      select: documentSelect,
    });
  }

  async findAll(): Promise<IDocumento[]> {
    return prisma.document.findMany({
      orderBy: { id: "asc" },
      select: documentSelect,
    });
  }

  async findByPqrsId(pqrsId: number): Promise<IDocumento[]> {
    return prisma.document.findMany({
      where: { pqrsId },
      orderBy: { id: "asc" },
      select: documentSelect,
    });
  }

  async update(data: UpdateDocumentoDTO): Promise<IDocumento | null> {
    const updateData: { url?: string; typeDocumentId?: number; pqrsId?: number } = {};

    if (data.url !== undefined) updateData.url = data.url;
    if (data.typeDocumentId !== undefined) updateData.typeDocumentId = data.typeDocumentId;
    if (data.pqrsId !== undefined) updateData.pqrsId = data.pqrsId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.document.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteDocumentoDTO): Promise<boolean> {
    const deleted = await prisma.document.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
