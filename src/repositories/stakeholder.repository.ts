import prisma from "../config/db.config";
import { Prisma } from "../../generated/prisma/client";
import { IStakeholder } from "../models/stakeholder.model";
import { CreateStakeholderDTO, UpdateStakeholderDTO, DeleteStakeholderDTO } from "../schemas/stakeholder.schema";

export class StakeholderRepository {
  private readonly table = "stakeholder";

  async create(data: CreateStakeholderDTO): Promise<IStakeholder> {
    const stakeholder = await prisma.stakeholder.create({
      data: {
        name: data.name,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return stakeholder;
  }

  async findById(id: number): Promise<IStakeholder | null> {
    const stakeholder = await prisma.stakeholder.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
    return stakeholder ?? null;
  }

  async findAll(): Promise<IStakeholder[]> {
    return prisma.stakeholder.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(data: UpdateStakeholderDTO): Promise<IStakeholder | null> {
    if (data.name === undefined) {
      return this.findById(data.id as number);
    }
    try {
      const stakeholder = await prisma.stakeholder.update({
        where: { id: data.id as number },
        data: {
          name: data.name,
        },
        select: {
          id: true,
          name: true,
        },
      });
      return stakeholder;
    } catch (error) {
      const err = error as Prisma.PrismaClientKnownRequestError;
      if (err?.code === "P2025") {
        return null;
      }
      throw error;
    }
  }

  async delete(data: DeleteStakeholderDTO): Promise<boolean> {
    const result = await prisma.stakeholder.deleteMany({
      where: { id: data.id },
    });
    return result.count > 0;
  }
}
