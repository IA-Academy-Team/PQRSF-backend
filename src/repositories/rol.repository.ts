import prisma from "../config/db.config";
import { IRol } from "../models/rol.model";
import { CreateRolDTO, UpdateRolDTO, DeleteRolDTO } from "../schemas/rol.schema";

const roleSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
} as const;

const toRol = (row: {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date | null;
}): IRol => ({
  id: row.id,
  name: row.name,
  description: row.description,
  createdAt: row.createdAt ?? new Date(),
});

export class RolRepository {
  private readonly table = "roles";

  async create(data: CreateRolDTO): Promise<IRol> {
    const created = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
      },
      select: roleSelect,
    });
    return toRol(created);
  }

  async findById(id: number): Promise<IRol | null> {
    const found = await prisma.role.findUnique({
      where: { id },
      select: roleSelect,
    });
    return found ? toRol(found) : null;
  }

  async findAll(): Promise<IRol[]> {
    const rows = await prisma.role.findMany({
      orderBy: { id: "asc" },
      select: roleSelect,
    });
    return rows.map(toRol);
  }

  async findByName(name: string): Promise<IRol | null> {
    const found = await prisma.role.findUnique({
      where: { name },
      select: roleSelect,
    });
    return found ? toRol(found) : null;
  }

  async update(data: UpdateRolDTO): Promise<IRol | null> {
    const updateData: { name?: string; description?: string | null; createdAt?: Date } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.role.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteRolDTO): Promise<boolean> {
    const deleted = await prisma.role.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
