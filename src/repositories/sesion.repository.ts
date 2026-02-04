import prisma from "../config/db.config";
import { Prisma } from "@prisma/client";
import { ISesion } from "../models/sesion.model";
import {
  CreateSesionDTO,
  UpdateSesionDTO,
  DeleteSesionDTO,
} from "../schemas/sesion.schema";

export class SesionRepository {
  private readonly selectFields = {
    id: true,
    token: true,
    expiresAt: true,
    ipAddress: true,
    userAgent: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  } as const;

  private toSesion(row: {
    id: number;
    token: string;
    expiresAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date | null;
    updatedAt: Date;
    userId: number;
  }): ISesion {
    return {
      id: row.id,
      token: row.token,
      expiresAt: row.expiresAt,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt,
      userId: row.userId,
    };
  }

  async create(data: CreateSesionDTO): Promise<ISesion> {
    const created = await prisma.session.create({
      data: {
        token: data.token,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        updatedAt: new Date(),
        userId: data.userId,
      },
      select: this.selectFields,
    });
    return this.toSesion(created);
  }

  async findById(id: number): Promise<ISesion | null> {
    const found = await prisma.session.findUnique({
      where: { id },
      select: this.selectFields,
    });
    return found ? this.toSesion(found) : null;
  }

  async findAll(): Promise<ISesion[]> {
    const rows = await prisma.session.findMany({
      orderBy: { id: "asc" },
      select: this.selectFields,
    });
    return rows.map((row) => this.toSesion(row));
  }

  async findByToken(token: string): Promise<ISesion | null> {
    const found = await prisma.session.findUnique({
      where: { token },
      select: this.selectFields,
    });
    return found ? this.toSesion(found) : null;
  }

  async update(data: UpdateSesionDTO): Promise<ISesion | null> {
    const updateData: Prisma.SessionUncheckedUpdateInput = {};

    if (data.token !== undefined) updateData.token = data.token;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ?? undefined;
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
      const updated = await prisma.session.update({
        where: { id: data.id as number },
        data: updateData,
        select: this.selectFields,
      });
      return this.toSesion(updated);
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
