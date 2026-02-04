import prisma from "../config/db.config";
import { INotificacion } from "../models/notificacion.model";
import { CreateNotificacionDTO, UpdateNotificacionDTO, DeleteNotificacionDTO } from "../schemas/notificacion.schema";

const notificationSelect = {
  id: true,
  message: true,
  status: true,
  responsibleId: true,
  pqrsId: true,
  createdAt: true,
} as const;

const toNotificacion = (row: {
  id: number;
  message: string;
  status: number | null;
  responsibleId: number;
  pqrsId: number;
  createdAt: Date | null;
}): INotificacion => ({
  id: row.id,
  message: row.message,
  status: row.status ?? 1,
  responsibleId: row.responsibleId,
  pqrsId: row.pqrsId,
  createdAt: row.createdAt ?? new Date(),
});

export class NotificacionRepository {
  private readonly table = "notification";

  async create(data: CreateNotificacionDTO): Promise<INotificacion> {
    const created = await prisma.notification.create({
      data: {
        message: data.message,
        ...(data.status !== undefined ? { status: data.status } : {}),
        responsibleId: data.responsibleId,
        pqrsId: data.pqrsId,
      },
      select: notificationSelect,
    });
    return toNotificacion(created);
  }

  async findById(id: number): Promise<INotificacion | null> {
    const found = await prisma.notification.findUnique({
      where: { id },
      select: notificationSelect,
    });
    return found ? toNotificacion(found) : null;
  }

  async findAll(): Promise<INotificacion[]> {
    const rows = await prisma.notification.findMany({
      orderBy: { id: "asc" },
      select: notificationSelect,
    });
    return rows.map(toNotificacion);
  }

  async findByResponsibleId(responsibleId: number): Promise<INotificacion[]> {
    const rows = await prisma.notification.findMany({
      where: { responsibleId },
      orderBy: { createdAt: "desc" },
      select: notificationSelect,
    });
    return rows.map(toNotificacion);
  }

  async countUnread(responsibleId: number): Promise<number> {
    return prisma.notification.count({
      where: { responsibleId, status: 1 },
    });
  }

  async markAsRead(ids: number[]): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }
    const updated = await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { status: 2 },
    });
    return updated.count;
  }

  async markAllAsReadByResponsible(responsibleId: number): Promise<number> {
    const updated = await prisma.notification.updateMany({
      where: { responsibleId, status: 1 },
      data: { status: 2 },
    });
    return updated.count;
  }

  async update(data: UpdateNotificacionDTO): Promise<INotificacion | null> {
    const updateData: {
      message?: string | null;
      status?: number;
      responsibleId?: number;
      pqrsId?: number;
      createdAt?: Date;
    } = {};

    if (data.message !== undefined) updateData.message = data.message;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.responsibleId !== undefined) updateData.responsibleId = data.responsibleId;
    if (data.pqrsId !== undefined) updateData.pqrsId = data.pqrsId;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.notification.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteNotificacionDTO): Promise<boolean> {
    const deleted = await prisma.notification.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
