import prisma from "../config/db.config";
import { ISesion } from "../models/sesion.model";
import {
  CreateSesionDTO,
  UpdateSesionDTO,
  DeleteSesionDTO,
} from "../schemas/sesion.schema";

export class SesionRepository {
  async create(data: CreateSesionDTO): Promise<ISesion> {
    return prisma.session.create({
      data: {
        token: data.token,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        userId: data.userId,
      },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
  }

  async findById(id: number): Promise<ISesion | null> {
    return prisma.session.findUnique({
      where: { id },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
  }

  async findAll(): Promise<ISesion[]> {
    return prisma.session.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
  }

  async findByToken(token: string): Promise<ISesion | null> {
    return prisma.session.findUnique({
      where: { token },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
  }

  async update(data: UpdateSesionDTO): Promise<ISesion | null> {
    const updateData: Partial<ISesion> = {};

    if (data.token !== undefined) updateData.token = data.token;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;
    if (data.ipAddress !== undefined) updateData.ipAddress = data.ipAddress;
    if (data.userAgent !== undefined) updateData.userAgent = data.userAgent;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;
    if (data.updatedAt !== undefined) updateData.updatedAt = data.updatedAt;
    if (data.userId !== undefined) updateData.userId = data.userId;

    // 🔁 MISMA lógica que antes
    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    try {
      return await prisma.session.update({
        where: { id: data.id as number },
        data: updateData,
        select: {
          id: true,
          token: true,
          expiresAt: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      });
    } catch {
      return null;
    }
  }

  async delete(data: DeleteSesionDTO): Promise<boolean> {
    try {
      await prisma.session.delete({
        where: { id: data.id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
