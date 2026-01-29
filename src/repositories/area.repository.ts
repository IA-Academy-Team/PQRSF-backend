import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { IArea } from "../models/area.model";
import { CreateAreaDTO, UpdateAreaDTO, DeleteAreaDTO } from "../schemas/area.schema";

export class AreaRepository {
  private readonly table = "area";

  async create(data: CreateAreaDTO): Promise<IArea> {
    const result = await pool.query(
      `INSERT INTO area (name, code, description) VALUES ($1, $2, $3) RETURNING id, name, code, description`,
      normalizeValues([data.name, data.code, data.description])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IArea | null> {
    const result = await pool.query(
      `SELECT id, name, code, description FROM area WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IArea[]> {
    const result = await pool.query(`SELECT id, name, code, description FROM area ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateAreaDTO): Promise<IArea | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.name !== undefined) {
      fields.push(`name = $${index}`);
      values.push(data.name);
      index += 1;
    }
    if (data.code !== undefined) {
      fields.push(`code = $${index}`);
      values.push(data.code);
      index += 1;
    }
    if (data.description !== undefined) {
      fields.push(`description = $${index}`);
      values.push(data.description);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE area SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name, code, description`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteAreaDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM area WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
