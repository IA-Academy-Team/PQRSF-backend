import prisma from "../config/db.config";
import { IRespuesta } from "../models/respuesta.model";
import { CreateRespuestaDTO, UpdateRespuestaDTO, DeleteRespuestaDTO } from "../schemas/respuesta.schema";

const responseSelect = {
  id: true,
  content: true,
  channel: true,
  sentAt: true,
  documentId: true,
  pqrsId: true,
  responsibleId: true,
} as const;

const toRespuesta = (row: {
  id: number;
  pqrsId: number;
  responsibleId: number;
  content: string;
  channel: number;
  sentAt: Date | null;
  documentId: number | null;
}): IRespuesta => ({
  id: row.id,
  pqrsId: row.pqrsId,
  responsibleId: row.responsibleId,
  content: row.content,
  channel: row.channel,
  sentAt: row.sentAt ?? new Date(),
  documentId: row.documentId,
});

export class RespuestaRepository {
  private readonly table = "response";

  async create(data: CreateRespuestaDTO): Promise<IRespuesta> {
    const created = await prisma.response.create({
      data: {
        content: data.content,
        channel: data.channel as number,
        documentId: data.documentId,
        pqrsId: data.pqrsId,
        responsibleId: data.responsibleId,
      },
      select: responseSelect,
    });
    return toRespuesta(created);
  }

  async findById(id: number): Promise<IRespuesta | null> {
    const found = await prisma.response.findUnique({
      where: { id },
      select: responseSelect,
    });
    return found ? toRespuesta(found) : null;
  }

  async findAll(): Promise<IRespuesta[]> {
    const rows = await prisma.response.findMany({
      orderBy: { id: "asc" },
      select: responseSelect,
    });
    return rows.map(toRespuesta);
  }

  async findByPqrsId(pqrsId: number): Promise<IRespuesta[]> {
    const rows = await prisma.response.findMany({
      where: { pqrsId },
      orderBy: { id: "asc" },
      select: responseSelect,
    });
    return rows.map(toRespuesta);
  }

  async update(data: UpdateRespuestaDTO): Promise<IRespuesta | null> {
    const updateData: {
      content?: string;
      channel?: number;
      sentAt?: Date | null;
      documentId?: number | null;
      pqrsId?: number;
      responsibleId?: number;
    } = {};

    if (data.content !== undefined) updateData.content = data.content;
    if (data.channel !== undefined) updateData.channel = data.channel;
    if (data.sentAt !== undefined) updateData.sentAt = data.sentAt ?? null;
    if (data.documentId !== undefined) updateData.documentId = data.documentId ?? null;
    if (data.pqrsId !== undefined) updateData.pqrsId = data.pqrsId;
    if (data.responsibleId !== undefined) updateData.responsibleId = data.responsibleId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.response.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteRespuestaDTO): Promise<boolean> {
    const deleted = await prisma.response.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
