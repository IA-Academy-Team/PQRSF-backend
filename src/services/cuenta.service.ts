import { CreateCuentaDTO, DeleteCuentaDTO, UpdateCuentaDTO } from "../DTOs/cuenta.dto";
import { ICuenta } from "../models/ICuenta";
import { CuentaRepository } from "../repositories/cuenta.repository";
import { UsuarioRepository } from "../repositories/usuario.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalDate,
  optionalString,
  requirePositiveInt,
  requireString,
} from "../utils/validation.utils";

export class CuentaService {
  constructor(
    private readonly repo = new CuentaRepository(),
    private readonly usuarioRepo = new UsuarioRepository()
  ) {}

  async create(data: CreateCuentaDTO): Promise<ICuenta> {
    const providerId = requireString(data.providerId, "providerId");
    const providerAccountId = requireString(
      data.providerAccountId,
      "providerAccountId"
    );
    const userId = requirePositiveInt(data.userId, "userId");

    ensureFound("User", await this.usuarioRepo.findById(userId), { userId });

    const existing = await this.repo.findByProvider(providerId, providerAccountId);
    if (existing) {
      throw new AppError(
        "Account already exists for provider",
        409,
        "CONFLICT",
        { providerId, providerAccountId }
      );
    }

    return this.repo.create({
      providerId,
      providerAccountId,
      password: data.password ?? null,
      accessToken: data.accessToken ?? null,
      refreshToken: data.refreshToken ?? null,
      idToken: data.idToken ?? null,
      accessTokenExpiresAt: data.accessTokenExpiresAt
        ? optionalDate(data.accessTokenExpiresAt, "accessTokenExpiresAt")
        : null,
      refreshTokenExpiresAt: data.refreshTokenExpiresAt
        ? optionalDate(data.refreshTokenExpiresAt, "refreshTokenExpiresAt")
        : null,
      scope: data.scope ?? null,
      userId,
    });
  }

  async findById(id: number): Promise<ICuenta> {
    const account = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("Account", account, { id });
  }

  async update(data: UpdateCuentaDTO): Promise<ICuenta> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(
      data as Record<string, unknown>,
      [
        "providerId",
        "providerAccountId",
        "password",
        "accessToken",
        "refreshToken",
        "idToken",
        "accessTokenExpiresAt",
        "refreshTokenExpiresAt",
        "scope",
        "userId",
      ],
      "Account"
    );

    if (data.providerId !== undefined || data.providerAccountId !== undefined) {
      const providerId =
        data.providerId !== undefined
          ? requireString(data.providerId, "providerId")
          : undefined;
      const providerAccountId =
        data.providerAccountId !== undefined
          ? requireString(data.providerAccountId, "providerAccountId")
          : undefined;
      if (providerId && providerAccountId) {
        const existing = await this.repo.findByProvider(
          providerId,
          providerAccountId
        );
        if (existing && existing.id !== id) {
          throw new AppError(
            "Account already exists for provider",
            409,
            "CONFLICT",
            { providerId, providerAccountId }
          );
        }
      }
    }

    if (data.userId !== undefined) {
      const userId = requirePositiveInt(data.userId, "userId");
      ensureFound("User", await this.usuarioRepo.findById(userId), { userId });
    }

    const updated = await this.repo.update({
      id,
      providerId: data.providerId !== undefined ? requireString(data.providerId, "providerId") : undefined,
      providerAccountId:
        data.providerAccountId !== undefined
          ? requireString(data.providerAccountId, "providerAccountId")
          : undefined,
      password: data.password ?? undefined,
      accessToken: data.accessToken ?? undefined,
      refreshToken: data.refreshToken ?? undefined,
      idToken: data.idToken ?? undefined,
      accessTokenExpiresAt:
        data.accessTokenExpiresAt !== undefined
          ? optionalDate(data.accessTokenExpiresAt, "accessTokenExpiresAt")
          : undefined,
      refreshTokenExpiresAt:
        data.refreshTokenExpiresAt !== undefined
          ? optionalDate(data.refreshTokenExpiresAt, "refreshTokenExpiresAt")
          : undefined,
      scope: data.scope ?? undefined,
      userId: data.userId !== undefined ? requirePositiveInt(data.userId, "userId") : undefined,
    });
    return ensureFound("Account", updated, { id });
  }

  async delete(data: DeleteCuentaDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
