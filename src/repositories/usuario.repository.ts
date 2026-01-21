import pool from "../config/db";
import { normalizeValues } from "./repository.utils";
import { IUsuario } from "../models/usuario.model";
import { CreateUsuarioDTO, UpdateUsuarioDTO, DeleteUsuarioDTO } from "../DTOs/usuario.dto";

export class UsuarioRepository {
  private readonly table = "users";

  async create(data: CreateUsuarioDTO): Promise<IUsuario> {
    const result = await pool.query(
      `INSERT INTO users (email, name, image, phone_number, is_active, email_verified, two_factor_enabled, last_login, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, email, name, image, phone_number AS "phoneNumber", is_active AS "isActive", email_verified AS "emailVerified", two_factor_enabled AS "twoFactorEnabled", last_login AS "lastLogin", created_at AS "createdAt", updated_at AS "updatedAt", role_id AS "roleId"`,
      normalizeValues([data.email, data.name, data.image, data.phoneNumber, data.isActive, data.emailVerified, data.twoFactorEnabled, data.lastLogin, data.roleId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IUsuario | null> {
    const result = await pool.query(
      `SELECT id, email, name, image, phone_number AS "phoneNumber", is_active AS "isActive", email_verified AS "emailVerified", two_factor_enabled AS "twoFactorEnabled", last_login AS "lastLogin", created_at AS "createdAt", updated_at AS "updatedAt", role_id AS "roleId" FROM users WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IUsuario[]> {
    const result = await pool.query(`SELECT id, email, name, image, phone_number AS "phoneNumber", is_active AS "isActive", email_verified AS "emailVerified", two_factor_enabled AS "twoFactorEnabled", last_login AS "lastLogin", created_at AS "createdAt", updated_at AS "updatedAt", role_id AS "roleId" FROM users ORDER BY id`);
    return result.rows;
  }

  async findByEmail(email: string): Promise<IUsuario | null> {
    const result = await pool.query(
      `SELECT id, email, name, image, phone_number AS "phoneNumber", is_active AS "isActive", email_verified AS "emailVerified", two_factor_enabled AS "twoFactorEnabled", last_login AS "lastLogin", created_at AS "createdAt", updated_at AS "updatedAt", role_id AS "roleId" FROM users WHERE email = $1`,
      normalizeValues([email])
    );
    return result.rows[0] ?? null;
  }

  async update(data: UpdateUsuarioDTO): Promise<IUsuario | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.email !== undefined) {
      fields.push(`email = $${index}`);
      values.push(data.email);
      index += 1;
    }
    if (data.name !== undefined) {
      fields.push(`name = $${index}`);
      values.push(data.name);
      index += 1;
    }
    if (data.image !== undefined) {
      fields.push(`image = $${index}`);
      values.push(data.image);
      index += 1;
    }
    if (data.phoneNumber !== undefined) {
      fields.push(`phone_number = $${index}`);
      values.push(data.phoneNumber);
      index += 1;
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${index}`);
      values.push(data.isActive);
      index += 1;
    }
    if (data.emailVerified !== undefined) {
      fields.push(`email_verified = $${index}`);
      values.push(data.emailVerified);
      index += 1;
    }
    if (data.twoFactorEnabled !== undefined) {
      fields.push(`two_factor_enabled = $${index}`);
      values.push(data.twoFactorEnabled);
      index += 1;
    }
    if (data.lastLogin !== undefined) {
      fields.push(`last_login = $${index}`);
      values.push(data.lastLogin);
      index += 1;
    }
    if (data.createdAt !== undefined) {
      fields.push(`created_at = $${index}`);
      values.push(data.createdAt);
      index += 1;
    }
    if (data.updatedAt !== undefined) {
      fields.push(`updated_at = $${index}`);
      values.push(data.updatedAt);
      index += 1;
    }
    if (data.roleId !== undefined) {
      fields.push(`role_id = $${index}`);
      values.push(data.roleId);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, email, name, image, phone_number AS "phoneNumber", is_active AS "isActive", email_verified AS "emailVerified", two_factor_enabled AS "twoFactorEnabled", last_login AS "lastLogin", created_at AS "createdAt", updated_at AS "updatedAt", role_id AS "roleId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteUsuarioDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
