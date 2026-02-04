import prisma from "../config/db.config";
import { IReanalisis } from "../models/reanalisis.model";
import { CreateReanalisisDTO, UpdateReanalisisDTO, DeleteReanalisisDTO } from "../schemas/reanalisis.schema";

const reanalysisSelect = {
  id: true,
  answer: true,
  actionTaken: true,
  createdAt: true,
  analysisId: true,
  responsibleId: true,
} as const;

const toReanalisis = (row: {
  id: number;
  answer: string | null;
  actionTaken: string | null;
  createdAt: Date | null;
  analysisId: number;
  responsibleId: number;
}): IReanalisis => ({
  id: row.id,
  answer: row.answer,
  actionTaken: row.actionTaken,
  createdAt: row.createdAt ?? new Date(),
  analysisId: row.analysisId,
  responsibleId: row.responsibleId,
});

export class ReanalisisRepository {
  private readonly table = "reanalysis";

  async create(data: CreateReanalisisDTO): Promise<IReanalisis> {
    const created = await prisma.reanalysis.create({
      data: {
        answer: data.answer,
        actionTaken: data.actionTaken,
        analysisId: data.analysisId,
        responsibleId: data.responsibleId,
      },
      select: reanalysisSelect,
    });
    return toReanalisis(created);
  }

  async findById(id: number): Promise<IReanalisis | null> {
    const found = await prisma.reanalysis.findUnique({
      where: { id },
      select: reanalysisSelect,
    });
    return found ? toReanalisis(found) : null;
  }

  async findAll(): Promise<IReanalisis[]> {
    const rows = await prisma.reanalysis.findMany({
      orderBy: { id: "asc" },
      select: reanalysisSelect,
    });
    return rows.map(toReanalisis);
  }

  async findByAnalysisId(analysisId: number): Promise<IReanalisis | null> {
    const found = await prisma.reanalysis.findFirst({
      where: { analysisId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: reanalysisSelect,
    });
    return found ? toReanalisis(found) : null;
  }

  async findByPqrsId(pqrsId: number): Promise<IReanalisis | null> {
    const found = await prisma.reanalysis.findFirst({
      where: { analysis: { pqrsId } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: reanalysisSelect,
    });
    return found ? toReanalisis(found) : null;
  }

  async findAllByPqrsId(pqrsId: number): Promise<IReanalisis[]> {
    const rows = await prisma.reanalysis.findMany({
      where: { analysis: { pqrsId } },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: reanalysisSelect,
    });
    return rows.map(toReanalisis);
  }

  async update(data: UpdateReanalisisDTO): Promise<IReanalisis | null> {
    const updateData: {
      answer?: string | null;
      actionTaken?: string | null;
      createdAt?: Date | null;
      analysisId?: number;
      responsibleId?: number;
    } = {};

    if (data.answer !== undefined) updateData.answer = data.answer;
    if (data.actionTaken !== undefined) updateData.actionTaken = data.actionTaken;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt ?? null;
    if (data.analysisId !== undefined) updateData.analysisId = data.analysisId;
    if (data.responsibleId !== undefined) updateData.responsibleId = data.responsibleId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.reanalysis.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteReanalisisDTO): Promise<boolean> {
    const deleted = await prisma.reanalysis.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
