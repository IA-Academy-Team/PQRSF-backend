import prisma from "../config/db.config";
import { IVerificacion } from "../models/verificacion.model";
import {
  CreateVerificacionDTO,
  UpdateVerificacionDTO,
  DeleteVerificacionDTO,
} from "../schemas/verificacion.schema";

export class VerificacionRepository {
  async create(data: CreateVerificacionDTO): Promise<IVerificacion> {
    return prisma.verification.create({
      data: {
        identifier: data.identifier,
        value: data.value,
        expiresAt: data.expiresAt,
      },
      select: {
        id: true,
        identifier: true,
        value: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: number): Promise<IVerificacion | null> {
    return prisma.verification.findUnique({
      where: { id },
      select: {
        id: true,
        identifier: true,
        value: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(): Promise<IVerificacion[]> {
    return prisma.verification.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        identifier: true,
        value: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<IVerificacion | null> {
    return prisma.verification.findFirst({
      where: { identifier },
      select: {
        id: true,
        identifier: true,
        value: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByIdentifierAndValue(
    identifier: string,
    value: string
  ): Promise<IVerificacion | null> {
    return prisma.verification.findFirst({
      where: {
        identifier,
        value,
      },
      select: {
        id: true,
        identifier: true,
        value: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(data: UpdateVerificacionDTO): Promise<IVerificacion | null> {
    const updateData: Partial<IVerificacion> = {};

    if (data.identifier !== undefined)
      updateData.identifier = data.identifier;

    if (data.value !== undefined)
      updateData.value = data.value;

    if (data.expiresAt !== undefined)
      updateData.expiresAt = data.expiresAt;

    if (data.createdAt !== undefined)
      updateData.createdAt = data.createdAt;

    if (data.updatedAt !== undefined)
      updateData.updatedAt = data.updatedAt;

    // 🔁 MISMA lógica que antes
    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    try {
      return await prisma.verification.update({
        where: { id: data.id as number },
        data: updateData,
        select: {
          id: true,
          identifier: true,
          value: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch {
      return null;
    }
  }

  async delete(data: DeleteVerificacionDTO): Promise<boolean> {
    try {
      await prisma.verification.delete({
        where: { id: data.id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
