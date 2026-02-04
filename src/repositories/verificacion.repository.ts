import prisma from "../config/db.config";
import { IVerificacion } from "../models/verificacion.model";
import {
  CreateVerificacionDTO,
  UpdateVerificacionDTO,
  DeleteVerificacionDTO,
} from "../schemas/verificacion.schema";

export class VerificacionRepository {
  private readonly selectFields = {
    id: true,
    identifier: true,
    value: true,
    expiresAt: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  private toVerificacion(row: {
    id: number;
    identifier: string;
    value: string;
    expiresAt: Date;
    createdAt: Date | null;
    updatedAt: Date | null;
  }): IVerificacion {
    return {
      id: row.id,
      identifier: row.identifier,
      value: row.value,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
    };
  }

  async create(data: CreateVerificacionDTO): Promise<IVerificacion> {
    const created = await prisma.verification.create({
      data: {
        identifier: data.identifier,
        value: data.value,
        expiresAt: data.expiresAt,
      },
      select: this.selectFields,
    });
    return this.toVerificacion(created);
  }

  async findById(id: number): Promise<IVerificacion | null> {
    const found = await prisma.verification.findUnique({
      where: { id },
      select: this.selectFields,
    });
    return found ? this.toVerificacion(found) : null;
  }

  async findAll(): Promise<IVerificacion[]> {
    const rows = await prisma.verification.findMany({
      orderBy: { id: "asc" },
      select: this.selectFields,
    });
    return rows.map((row) => this.toVerificacion(row));
  }

  async findByIdentifier(identifier: string): Promise<IVerificacion | null> {
    const found = await prisma.verification.findFirst({
      where: { identifier },
      select: this.selectFields,
    });
    return found ? this.toVerificacion(found) : null;
  }

  async findByIdentifierAndValue(
    identifier: string,
    value: string
  ): Promise<IVerificacion | null> {
    const found = await prisma.verification.findFirst({
      where: {
        identifier,
        value,
      },
      select: this.selectFields,
    });
    return found ? this.toVerificacion(found) : null;
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
      const updated = await prisma.verification.update({
        where: { id: data.id as number },
        data: updateData,
        select: this.selectFields,
      });
      return this.toVerificacion(updated);
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
