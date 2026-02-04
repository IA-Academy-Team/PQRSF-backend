import prisma from "../config/db.config";
import { IResponsable, IResponsableSummary } from "../models/responsable.model";
import { CreateResponsableDTO, UpdateResponsableDTO, DeleteResponsableDTO } from "../schemas/responsable.schema";

const responsibleSelect = {
  id: true,
  userId: true,
  areaId: true,
} as const;

export class ResponsableRepository {
  private readonly table = "responsible";

  async create(data: CreateResponsableDTO): Promise<IResponsable> {
    return prisma.responsible.create({
      data: {
        userId: data.userId,
        areaId: data.areaId,
      },
      select: responsibleSelect,
    });
  }

  async findById(id: number): Promise<IResponsable | null> {
    return prisma.responsible.findUnique({
      where: { id },
      select: responsibleSelect,
    });
  }

  async findAll(): Promise<IResponsable[]> {
    return prisma.responsible.findMany({
      orderBy: { id: "asc" },
      select: responsibleSelect,
    });
  }

  async findAllDetailed(): Promise<IResponsableSummary[]> {
    const rows = await prisma.responsible.findMany({
      orderBy: { id: "asc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            isActive: true,
            roleId: true,
          },
        },
        area: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      areaId: row.areaId,
      userName: row.user?.name ?? null,
      userEmail: row.user?.email ?? null,
      userIsActive: row.user?.isActive ?? true,
      roleId: row.user?.roleId ?? 1,
      areaName: row.area?.name ?? null,
      areaCode: row.area?.code ?? null,
    }));
  }

  async findByUserId(userId: number): Promise<IResponsable | null> {
    return prisma.responsible.findFirst({
      where: { userId },
      select: responsibleSelect,
    });
  }

  async findByAreaId(areaId: number): Promise<IResponsable[]> {
    return prisma.responsible.findMany({
      where: { areaId },
      orderBy: { id: "asc" },
      select: responsibleSelect,
    });
  }

  async update(data: UpdateResponsableDTO): Promise<IResponsable | null> {
    const updateData: { userId?: number; areaId?: number | null } = {};

    if (data.userId !== undefined) updateData.userId = data.userId;
    if (data.areaId !== undefined) updateData.areaId = data.areaId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.responsible.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteResponsableDTO): Promise<boolean> {
    const deleted = await prisma.responsible.deleteMany({ where: { id: data.id } });
    return deleted.count > 0;
  }
}
