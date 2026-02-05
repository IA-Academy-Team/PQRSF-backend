import prisma from "../config/db.config";
import { IPqrsStatusHistory } from "../models/pqrsStatusHistory.model";

export class PqrsStatusHistoryRepository {
  async create(data: {
    pqrsId: number;
    statusId: number;
    createdAt?: Date;
    note?: string | null;
  }): Promise<IPqrsStatusHistory> {
    const created = await prisma.pqrsStatusHistory.create({
      data: {
        pqrsId: data.pqrsId,
        statusId: data.statusId,
        createdAt: data.createdAt ?? undefined,
        note: data.note ?? null,
      },
      select: {
        id: true,
        pqrsId: true,
        statusId: true,
        createdAt: true,
        note: true,
      },
    });
    return {
      id: created.id,
      pqrsId: created.pqrsId,
      statusId: created.statusId,
      createdAt: created.createdAt ? created.createdAt.toISOString() : new Date().toISOString(),
      note: created.note ?? null,
    };
  }

  async listByPqrsId(pqrsId: number): Promise<IPqrsStatusHistory[]> {
    const rows = await prisma.pqrsStatusHistory.findMany({
      where: { pqrsId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        pqrsId: true,
        statusId: true,
        createdAt: true,
        note: true,
        status: {
          select: { name: true },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      pqrsId: row.pqrsId,
      statusId: row.statusId,
      statusName: row.status?.name ?? null,
      createdAt: row.createdAt ? row.createdAt.toISOString() : new Date().toISOString(),
      note: row.note ?? null,
    }));
  }
}
