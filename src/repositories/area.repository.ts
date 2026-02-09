import prisma from "../config/db.config";
import { IArea } from "../models/area.model";
import {
  CreateAreaDTO,
  UpdateAreaDTO,
  DeleteAreaDTO,
} from "../schemas/area.schema";

export class AreaRepository {
  async create(data: CreateAreaDTO): Promise<IArea> {
    return prisma.area.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
      },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
      },
    });
  }

  async findById(id: number): Promise<IArea | null> {
    return prisma.area.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
      },
    });
  }

  async findAll(): Promise<IArea[]> {
    return prisma.area.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
      },
    });
  }

  async update(data: UpdateAreaDTO): Promise<IArea | null> {
    const updateData: Partial<IArea> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.description !== undefined)
      updateData.description = data.description;

    // misma logica de entidad que antes:
    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    try {
      return await prisma.area.update({
        where: { id: data.id as number },
        data: updateData,
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
        },
      });
    } catch {
      return null;
    }
  }

  async delete(data: DeleteAreaDTO): Promise<boolean> {
    try {
      await prisma.area.delete({
        where: { id: data.id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
