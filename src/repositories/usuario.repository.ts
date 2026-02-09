import prisma from "../config/db.config";
import { IUsuario } from "../models/usuario.model";
import { CreateUsuarioDTO, UpdateUsuarioDTO, DeleteUsuarioDTO } from "../schemas/usuario.schema";

const userSelect = {
  id: true,
  email: true,
  name: true,
  image: true,
  phoneNumber: true,
  isActive: true,
  emailVerified: true,
  twoFactorEnabled: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
  roleId: true,
} as const;

const toUsuario = (row: {
  id: number;
  email: string;
  name: string | null;
  image: string | null;
  phoneNumber: string | null;
  isActive: boolean | null;
  emailVerified: boolean | null;
  twoFactorEnabled: boolean | null;
  lastLogin: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  roleId: number;
}): IUsuario => ({
  id: row.id,
  email: row.email,
  name: row.name,
  image: row.image,
  phoneNumber: row.phoneNumber,
  isActive: row.isActive ?? true,
  emailVerified: row.emailVerified ?? false,
  twoFactorEnabled: row.twoFactorEnabled ?? false,
  lastLogin: row.lastLogin,
  createdAt: row.createdAt ?? new Date(),
  updatedAt: row.updatedAt ?? new Date(),
  roleId: row.roleId,
});

export class UsuarioRepository {
  async create(data: CreateUsuarioDTO): Promise<IUsuario> {
    const created = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        image: data.image,
        phoneNumber: data.phoneNumber,
        isActive: data.isActive,
        emailVerified: data.emailVerified,
        twoFactorEnabled: data.twoFactorEnabled,
        lastLogin: data.lastLogin,
        roleId: data.roleId,
      },
      select: userSelect,
    });
    return toUsuario(created);
  }

  async findById(id: number): Promise<IUsuario | null> {
    const found = await prisma.user.findUnique({ where: { id }, select: userSelect });
    return found ? toUsuario(found) : null;
  }

  async findAll(): Promise<IUsuario[]> {
    const rows = await prisma.user.findMany({ orderBy: { id: "asc" }, select: userSelect });
    return rows.map(toUsuario);
  }

  async findByEmail(email: string): Promise<IUsuario | null> {
    const found = await prisma.user.findUnique({ where: { email }, select: userSelect });
    return found ? toUsuario(found) : null;
  }

  async update(data: UpdateUsuarioDTO): Promise<IUsuario | null> {
    const updateData: {
      email?: string;
      name?: string | null;
      image?: string | null;
      phoneNumber?: string | null;
      isActive?: boolean;
      emailVerified?: boolean;
      twoFactorEnabled?: boolean;
      lastLogin?: Date | null;
      createdAt?: Date;
      updatedAt?: Date;
      roleId?: number;
    } = {};

    if (data.email !== undefined) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified;
    if (data.twoFactorEnabled !== undefined) updateData.twoFactorEnabled = data.twoFactorEnabled;
    if (data.lastLogin !== undefined) updateData.lastLogin = data.lastLogin;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;
    if (data.updatedAt !== undefined) updateData.updatedAt = data.updatedAt;
    if (data.roleId !== undefined) updateData.roleId = data.roleId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.user.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteUsuarioDTO): Promise<boolean> {
    const deleted = await prisma.user.deleteMany({ where: { id: data.id } });
    return deleted.count > 0;
  }
}
