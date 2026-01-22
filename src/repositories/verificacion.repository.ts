import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { IVerificacion } from "../models/verificacion.model";
import { CreateVerificacionDTO, UpdateVerificacionDTO, DeleteVerificacionDTO } from "../schemas/verificacion.schema";

export class VerificacionRepository {
  private readonly table = "verifications";

  async create(data: CreateVerificacionDTO): Promise<IVerificacion> {
    const result = await pool.query(
      `INSERT INTO verifications (identifier, value, expires_at) VALUES ($1, $2, $3) RETURNING id, identifier, value, expires_at AS "expiresAt", created_at AS "createdAt", updated_at AS "updatedAt"`,
      normalizeValues([data.identifier, data.value, data.expiresAt])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IVerificacion | null> {
    const result = await pool.query(
      `SELECT id, identifier, value, expires_at AS "expiresAt", created_at AS "createdAt", updated_at AS "updatedAt" FROM verifications WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IVerificacion[]> {
    const result = await pool.query(`SELECT id, identifier, value, expires_at AS "expiresAt", created_at AS "createdAt", updated_at AS "updatedAt" FROM verifications ORDER BY id`);
    return result.rows;
  }

  async findByIdentifier(identifier: string): Promise<IVerificacion | null> {
    const result = await pool.query(
      `SELECT id, identifier, value, expires_at AS "expiresAt", created_at AS "createdAt", updated_at AS "updatedAt" FROM verifications WHERE identifier = $1`,
      normalizeValues([identifier])
    );
    return result.rows[0] ?? null;
  }

  async findByIdentifierAndValue(
    identifier: string,
    value: string
  ): Promise<IVerificacion | null> {
    const result = await pool.query(
      `SELECT id, identifier, value, expires_at AS "expiresAt", created_at AS "createdAt", updated_at AS "updatedAt" FROM verifications WHERE identifier = $1 AND value = $2`,
      normalizeValues([identifier, value])
    );
    return result.rows[0] ?? null;
  }

  async update(data: UpdateVerificacionDTO): Promise<IVerificacion | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.identifier !== undefined) {
      fields.push(`identifier = $${index}`);
      values.push(data.identifier);
      index += 1;
    }
    if (data.value !== undefined) {
      fields.push(`value = $${index}`);
      values.push(data.value);
      index += 1;
    }
    if (data.expiresAt !== undefined) {
      fields.push(`expires_at = $${index}`);
      values.push(data.expiresAt);
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
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE verifications SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, identifier, value, expires_at AS "expiresAt", created_at AS "createdAt", updated_at AS "updatedAt"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteVerificacionDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM verifications WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
