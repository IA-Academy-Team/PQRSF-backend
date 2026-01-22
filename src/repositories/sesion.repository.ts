import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { ISesion } from "../models/sesion.model";
import { CreateSesionDTO, UpdateSesionDTO, DeleteSesionDTO } from "../schemas/sesion.schema";

export class SesionRepository {
  private readonly table = "sessions";

  async create(data: CreateSesionDTO): Promise<ISesion> {
    const result = await pool.query(
      `INSERT INTO sessions (token, expires_at, ip_address, user_agent, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, token, expires_at AS "expiresAt", ip_address AS "ipAddress", user_agent AS "userAgent", created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId"`,
      normalizeValues([data.token, data.expiresAt, data.ipAddress, data.userAgent, data.userId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<ISesion | null> {
    const result = await pool.query(
      `SELECT id, token, expires_at AS "expiresAt", ip_address AS "ipAddress", user_agent AS "userAgent", created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId" FROM sessions WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<ISesion[]> {
    const result = await pool.query(`SELECT id, token, expires_at AS "expiresAt", ip_address AS "ipAddress", user_agent AS "userAgent", created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId" FROM sessions ORDER BY id`);
    return result.rows;
  }

  async findByToken(token: string): Promise<ISesion | null> {
    const result = await pool.query(
      `SELECT id, token, expires_at AS "expiresAt", ip_address AS "ipAddress", user_agent AS "userAgent", created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId" FROM sessions WHERE token = $1`,
      normalizeValues([token])
    );
    return result.rows[0] ?? null;
  }

  async update(data: UpdateSesionDTO): Promise<ISesion | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.token !== undefined) {
      fields.push(`token = $${index}`);
      values.push(data.token);
      index += 1;
    }
    if (data.expiresAt !== undefined) {
      fields.push(`expires_at = $${index}`);
      values.push(data.expiresAt);
      index += 1;
    }
    if (data.ipAddress !== undefined) {
      fields.push(`ip_address = $${index}`);
      values.push(data.ipAddress);
      index += 1;
    }
    if (data.userAgent !== undefined) {
      fields.push(`user_agent = $${index}`);
      values.push(data.userAgent);
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
    if (data.userId !== undefined) {
      fields.push(`user_id = $${index}`);
      values.push(data.userId);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE sessions SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, token, expires_at AS "expiresAt", ip_address AS "ipAddress", user_agent AS "userAgent", created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteSesionDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM sessions WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
