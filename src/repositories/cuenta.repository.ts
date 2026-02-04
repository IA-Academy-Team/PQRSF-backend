import prisma from "../config/db.config";
import { ICuenta } from "../models/cuenta.model";
import { CreateCuentaDTO, UpdateCuentaDTO, DeleteCuentaDTO } from "../schemas/cuenta.schema";

const accountSelect = {
  id: true,
  providerId: true,
  providerAccountId: true,
  password: true,
  accessToken: true,
  refreshToken: true,
  idToken: true,
  accessTokenExpiresAt: true,
  refreshTokenExpiresAt: true,
  scope: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
} as const;

const toCuenta = (row: {
  id: number;
  providerId: string;
  providerAccountId: string;
  password: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: number;
}): ICuenta => ({
  id: row.id,
  providerId: row.providerId,
  providerAccountId: row.providerAccountId,
  password: row.password,
  accessToken: row.accessToken,
  refreshToken: row.refreshToken,
  idToken: row.idToken,
  accessTokenExpiresAt: row.accessTokenExpiresAt,
  refreshTokenExpiresAt: row.refreshTokenExpiresAt,
  scope: row.scope,
  createdAt: row.createdAt ?? new Date(),
  updatedAt: row.updatedAt ?? new Date(),
  userId: row.userId,
});

export class CuentaRepository {
  private readonly table = "accounts";

  async create(data: CreateCuentaDTO): Promise<ICuenta> {
    const created = await prisma.account.create({
      data: {
        providerId: data.providerId,
        providerAccountId: data.providerAccountId,
        password: data.password,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        idToken: data.idToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt,
        scope: data.scope,
        userId: data.userId,
      },
      select: accountSelect,
    });
    return toCuenta(created);
  }

  async findById(id: number): Promise<ICuenta | null> {
    const found = await prisma.account.findUnique({
      where: { id },
      select: accountSelect,
    });
    return found ? toCuenta(found) : null;
  }

  async findAll(): Promise<ICuenta[]> {
    const rows = await prisma.account.findMany({
      orderBy: { id: "asc" },
      select: accountSelect,
    });
    return rows.map(toCuenta);
  }

  async findByProvider(
    providerId: string,
    providerAccountId: string
  ): Promise<ICuenta | null> {
    const found = await prisma.account.findUnique({
      where: {
        providerId_providerAccountId: {
          providerId,
          providerAccountId,
        },
      },
      select: accountSelect,
    });
    return found ? toCuenta(found) : null;
  }

  async update(data: UpdateCuentaDTO): Promise<ICuenta | null> {
    const updateData: {
      providerId?: string;
      providerAccountId?: string;
      password?: string | null;
      accessToken?: string | null;
      refreshToken?: string | null;
      idToken?: string | null;
      accessTokenExpiresAt?: Date | null;
      refreshTokenExpiresAt?: Date | null;
      scope?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
      userId?: number;
    } = {};

    if (data.providerId !== undefined) updateData.providerId = data.providerId;
    if (data.providerAccountId !== undefined) updateData.providerAccountId = data.providerAccountId;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.accessToken !== undefined) updateData.accessToken = data.accessToken;
    if (data.refreshToken !== undefined) updateData.refreshToken = data.refreshToken;
    if (data.idToken !== undefined) updateData.idToken = data.idToken;
    if (data.accessTokenExpiresAt !== undefined) updateData.accessTokenExpiresAt = data.accessTokenExpiresAt;
    if (data.refreshTokenExpiresAt !== undefined) updateData.refreshTokenExpiresAt = data.refreshTokenExpiresAt;
    if (data.scope !== undefined) updateData.scope = data.scope;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;
    if (data.updatedAt !== undefined) updateData.updatedAt = data.updatedAt;
    if (data.userId !== undefined) updateData.userId = data.userId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.account.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteCuentaDTO): Promise<boolean> {
    const deleted = await prisma.account.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
