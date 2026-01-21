import pool from "../config/db";
import { normalizeValues } from "./repository.utils";
import { IEstadoPqrs } from "../models/estado.model";
import { CreateEstadoPqrsDTO, UpdateEstadoPqrsDTO, DeleteEstadoPqrsDTO } from "../DTOs/estadoPqrs.dto";

export class EstadoPqrsRepository {
  private readonly table = "pqrs_status";

  async create(data: CreateEstadoPqrsDTO): Promise<IEstadoPqrs> {
    const result = await pool.query(
      `INSERT INTO pqrs_status (name) VALUES ($1) RETURNING id, name`,
      normalizeValues([data.name])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IEstadoPqrs | null> {
    const result = await pool.query(
      `SELECT id, name FROM pqrs_status WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IEstadoPqrs[]> {
    const result = await pool.query(`SELECT id, name FROM pqrs_status ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateEstadoPqrsDTO): Promise<IEstadoPqrs | null> {
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
      `UPDATE pqrs_status SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteEstadoPqrsDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM pqrs_status WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
