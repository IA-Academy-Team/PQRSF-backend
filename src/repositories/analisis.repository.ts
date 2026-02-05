import prisma from "../config/db.config";
import { IAnalisis } from "../models/analisis.model";
import { CreateAnalisisDTO, UpdateAnalisisDTO, DeleteAnalisisDTO } from "../schemas/analisis.schema";

const analysisSelect = {
  id: true,
  answer: true,
  actionTaken: true,
  createdAt: true,
  pqrsId: true,
  responsibleId: true,
} as const;

const toAnalisis = (row: {
  id: number;
  answer: string | null;
  actionTaken: string | null;
  createdAt: Date | null;
  pqrsId: number;
  responsibleId: number;
}): IAnalisis => ({
  id: row.id,
  answer: row.answer,
  actionTaken: row.actionTaken,
  createdAt: row.createdAt ?? new Date(),
  pqrsId: row.pqrsId,
  responsibleId: row.responsibleId,
});

export class AnalisisRepository {
  private readonly table = "analysis";

  async create(data: CreateAnalisisDTO): Promise<IAnalisis> {
    const created = await prisma.analysis.create({
      data: {
        answer: data.answer,
        actionTaken: data.actionTaken,
        pqrsId: data.pqrsId,
        responsibleId: data.responsibleId,
      },
      select: analysisSelect,
    });
    return toAnalisis(created);
  }

  async findById(id: number): Promise<IAnalisis | null> {
    const found = await prisma.analysis.findUnique({
      where: { id },
      select: analysisSelect,
    });
    return found ? toAnalisis(found) : null;
  }

  async findAll(): Promise<IAnalisis[]> {
    const rows = await prisma.analysis.findMany({
      orderBy: { id: "asc" },
      select: analysisSelect,
    });
    return rows.map(toAnalisis);
  }

  async findByPqrsId(pqrsId: number): Promise<IAnalisis | null> {
    const found = await prisma.analysis.findFirst({
      where: { pqrsId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: analysisSelect,
    });
    return found ? toAnalisis(found) : null;
  }

  async findAllByPqrsId(pqrsId: number): Promise<IAnalisis[]> {
    const rows = await prisma.analysis.findMany({
      where: { pqrsId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: analysisSelect,
    });
    return rows.map(toAnalisis);
  }

  async update(data: UpdateAnalisisDTO): Promise<IAnalisis | null> {
    const updateData: {
      answer?: string | null;
      actionTaken?: string | null;
      createdAt?: Date;
      pqrsId?: number;
      responsibleId?: number;
    } = {};

    if (data.answer !== undefined) updateData.answer = data.answer;
    if (data.actionTaken !== undefined) updateData.actionTaken = data.actionTaken;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;
    if (data.pqrsId !== undefined) updateData.pqrsId = data.pqrsId;
    if (data.responsibleId !== undefined) updateData.responsibleId = data.responsibleId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.analysis.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteAnalisisDTO): Promise<boolean> {
    const deleted = await prisma.analysis.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
