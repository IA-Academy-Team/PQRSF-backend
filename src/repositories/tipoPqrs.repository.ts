import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { ITipoPqrs } from "../models/tipoPqrs.model";
import { CreateTipoPqrsDTO, UpdateTipoPqrsDTO, DeleteTipoPqrsDTO } from "../schemas/tipoPqrs.schema";

export class TipoPqrsRepository {
  private readonly table = "type_pqrs";

  async create(data: CreateTipoPqrsDTO): Promise<ITipoPqrs> {
    const result = await pool.query(
      `INSERT INTO type_pqrs (name) VALUES ($1) RETURNING id, name`,
      normalizeValues([data.name])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<ITipoPqrs | null> {
    const result = await pool.query(
      `SELECT id, name FROM type_pqrs WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<ITipoPqrs[]> {
    const result = await pool.query(`SELECT id, name FROM type_pqrs ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateTipoPqrsDTO): Promise<ITipoPqrs | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.name !== undefined) {
      fields.push(`name = $${index}`);
      values.push(data.name);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE type_pqrs SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteTipoPqrsDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM type_pqrs WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
