import { CreateUsuarioDTO, DeleteUsuarioDTO, UpdateUsuarioDTO } from "../schemas/usuario.schema";
import { IUsuario } from "../models/usuario.model";
import { UsuarioRepository } from "../repositories/usuario.repository";
import { RolRepository } from "../repositories/rol.repository";
import { AppError } from "../middlewares/error.middleware";
import {
  ensureFound,
  ensureUpdates,
  optionalBoolean,
  optionalEmail,
  optionalPositiveInt,
  optionalString,
  requireEmail,
  requirePositiveInt,
} from "../utils/validation.utils";

export class UsuarioService {
  constructor(
    private readonly repo = new UsuarioRepository(),
    private readonly rolRepo = new RolRepository()
  ) {}

  async create(data: CreateUsuarioDTO): Promise<IUsuario> {
    const email = requireEmail(data.email, "email");
    const roleId = requirePositiveInt(data.roleId, "roleId");

    const existing = await this.repo.findByEmail(email);
    if (existing) {
      throw new AppError("Email already exists", 409, "CONFLICT", { email });
    }
    ensureFound("Role", await this.rolRepo.findById(roleId), { roleId });

    return this.repo.create({
      email,
      name: optionalString(data.name, "name") ?? null,
      image: optionalString(data.image, "image") ?? null,
      phoneNumber: optionalString(data.phoneNumber, "phoneNumber") ?? null,
      isActive: optionalBoolean(data.isActive, "isActive") ?? true,
      emailVerified: optionalBoolean(data.emailVerified, "emailVerified") ?? false,
      twoFactorEnabled:
        optionalBoolean(data.twoFactorEnabled, "twoFactorEnabled") ?? false,
      lastLogin: data.lastLogin ?? null,
      roleId,
    });
  }

  async findById(id: number): Promise<IUsuario> {
    const user = await this.repo.findById(requirePositiveInt(id, "id"));
    return ensureFound("User", user, { id });
  }

  async list(): Promise<IUsuario[]> {
    return this.repo.findAll();
  }

  async findByEmail(email: string): Promise<IUsuario> {
    const user = await this.repo.findByEmail(requireEmail(email, "email"));
    return ensureFound("User", user, { email });
  }

  async update(data: UpdateUsuarioDTO): Promise<IUsuario> {
    const id = requirePositiveInt(data.id, "id");
    ensureUpdates(
      data as Record<string, unknown>,
      [
        "email",
        "name",
        "image",
        "phoneNumber",
        "isActive",
        "emailVerified",
        "twoFactorEnabled",
        "lastLogin",
        "roleId",
      ],
      "User"
    );

    if (data.email !== undefined) {
      const email = requireEmail(data.email, "email");
      const existing = await this.repo.findByEmail(email);
      if (existing && existing.id !== id) {
        throw new AppError("Email already exists", 409, "CONFLICT", { email });
      }
    }

    if (data.roleId !== undefined) {
      const roleId = requirePositiveInt(data.roleId, "roleId");
      ensureFound("Role", await this.rolRepo.findById(roleId), { roleId });
    }

    const updated = await this.repo.update({
      id,
      email:
        data.email !== undefined
          ? data.email === null
            ? undefined
            : requireEmail(data.email, "email")
          : undefined,
      name: data.name !== undefined ? optionalString(data.name, "name") : undefined,
      image: data.image !== undefined ? optionalString(data.image, "image") : undefined,
      phoneNumber:
        data.phoneNumber !== undefined
          ? optionalString(data.phoneNumber, "phoneNumber")
          : undefined,
      isActive:
        data.isActive !== undefined ? optionalBoolean(data.isActive, "isActive") : undefined,
      emailVerified:
        data.emailVerified !== undefined
          ? optionalBoolean(data.emailVerified, "emailVerified")
          : undefined,
      twoFactorEnabled:
        data.twoFactorEnabled !== undefined
          ? optionalBoolean(data.twoFactorEnabled, "twoFactorEnabled")
          : undefined,
      lastLogin: data.lastLogin ?? undefined,
      roleId: data.roleId !== undefined ? optionalPositiveInt(data.roleId, "roleId") : undefined,
    });
    return ensureFound("User", updated, { id });
  }

  async updateStatus(id: number, isActive?: boolean): Promise<IUsuario> {
    const userId = requirePositiveInt(id, "id");
    const current = await this.findById(userId);
    const nextStatus = isActive !== undefined ? isActive : !current.isActive;
    const updated = await this.repo.update({
      id: userId,
      isActive: nextStatus,
    });
    return ensureFound("User", updated, { id: userId });
  }

  async delete(data: DeleteUsuarioDTO): Promise<boolean> {
    const id = requirePositiveInt(data.id, "id");
    await this.findById(id);
    return this.repo.delete({ id });
  }
}
