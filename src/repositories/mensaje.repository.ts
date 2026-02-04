import prisma from "../config/db.config";
import { IMensaje } from "../models/mensaje.model";
import { CreateMensajeDTO, UpdateMensajeDTO, DeleteMensajeDTO } from "../schemas/mensaje.schema";

const messageSelect = {
  id: true,
  content: true,
  type: true,
  createdAt: true,
  chatId: true,
} as const;

const toMensaje = (row: {
  id: number;
  content: string | null;
  type: number | null;
  createdAt: Date | null;
  chatId: bigint;
}): IMensaje => ({
  id: row.id,
  content: row.content,
  type: row.type,
  createdAt: row.createdAt ?? new Date(),
  chatId: row.chatId,
});

export class MensajeRepository {
  private readonly table = "message";

  async create(data: CreateMensajeDTO): Promise<IMensaje> {
    const created = await prisma.message.create({
      data: {
        content: data.content,
        type: data.type,
        chatId: data.chatId,
      },
      select: messageSelect,
    });
    return toMensaje(created);
  }

  async findById(id: number): Promise<IMensaje | null> {
    const found = await prisma.message.findUnique({
      where: { id },
      select: messageSelect,
    });
    return found ? toMensaje(found) : null;
  }

  async findAll(): Promise<IMensaje[]> {
    const rows = await prisma.message.findMany({
      orderBy: { id: "asc" },
      select: messageSelect,
    });
    return rows.map(toMensaje);
  }

  async findByChatId(chatId: bigint): Promise<IMensaje[]> {
    const rows = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      select: messageSelect,
    });
    return rows.map(toMensaje);
  }

  async findByChatIdAndRange(chatId: bigint, startAt: Date, endAt: Date | null): Promise<IMensaje[]> {
    const rows = await prisma.message.findMany({
      where: {
        chatId,
        createdAt: {
          gte: startAt,
          ...(endAt ? { lt: endAt } : {}),
        },
      },
      orderBy: { createdAt: "asc" },
      select: messageSelect,
    });
    return rows.map(toMensaje);
  }

  async update(data: UpdateMensajeDTO): Promise<IMensaje | null> {
    const updateData: {
      content?: string | null;
      type?: number | null;
      createdAt?: Date;
      chatId?: bigint;
    } = {};

    if (data.content !== undefined) updateData.content = data.content;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;
    if (data.chatId !== undefined) updateData.chatId = data.chatId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.message.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteMensajeDTO): Promise<boolean> {
    const deleted = await prisma.message.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
