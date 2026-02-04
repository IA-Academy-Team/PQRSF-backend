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

export class ReanalisisRepository {
  private readonly table = "reanalysis";

  async create(data: CreateReanalisisDTO): Promise<IReanalisis> {
    return prisma.reanalysis.create({
      data: {
        answer: data.answer,
        actionTaken: data.actionTaken,
        analysisId: data.analysisId,
        responsibleId: data.responsibleId,
      },
      select: reanalysisSelect,
    });
  }

  async findById(id: number): Promise<IReanalisis | null> {
    return prisma.reanalysis.findUnique({
      where: { id },
      select: reanalysisSelect,
    });
  }

  async findAll(): Promise<IReanalisis[]> {
    return prisma.reanalysis.findMany({
      orderBy: { id: "asc" },
      select: reanalysisSelect,
    });
  }

  async findByAnalysisId(analysisId: number): Promise<IReanalisis | null> {
    return prisma.reanalysis.findFirst({
      where: { analysisId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: reanalysisSelect,
    });
  }

  async findByPqrsId(pqrsId: number): Promise<IReanalisis | null> {
    return prisma.reanalysis.findFirst({
      where: { analysis: { pqrsId } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: reanalysisSelect,
    });
  }

  async findAllByPqrsId(pqrsId: number): Promise<IReanalisis[]> {
    return prisma.reanalysis.findMany({
      where: { analysis: { pqrsId } },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: reanalysisSelect,
    });
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
