import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { IRol } from "../models/rol.model";
import { CreateRolDTO, UpdateRolDTO, DeleteRolDTO } from "../DTOs/rol.dto";

export class RolRepository {
  private readonly table = "roles";

  async create(data: CreateRolDTO): Promise<IRol> {
    const result = await pool.query(
      `INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING id, name, description, created_at AS "createdAt"`,
      normalizeValues([data.name, data.description])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IRol | null> {
    const result = await pool.query(
      `SELECT id, name, description, created_at AS "createdAt" FROM roles WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IRol[]> {
    const result = await pool.query(`SELECT id, name, description, created_at AS "createdAt" FROM roles ORDER BY id`);
    return result.rows;
  }

  async findByName(name: string): Promise<IRol | null> {
    const result = await pool.query(
      `SELECT id, name, description, created_at AS "createdAt" FROM roles WHERE name = $1`,
      normalizeValues([name])
    );
    return result.rows[0] ?? null;
  }

  async update(data: UpdateRolDTO): Promise<IRol | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.name !== undefined) {
      fields.push(`name = $${index}`);
      values.push(data.name);
      index += 1;
    }
    if (data.description !== undefined) {
      fields.push(`description = $${index}`);
      values.push(data.description);
      index += 1;
    }
    if (data.createdAt !== undefined) {
      fields.push(`created_at = $${index}`);
      values.push(data.createdAt);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE roles SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name, description, created_at AS "createdAt"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteRolDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM roles WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
