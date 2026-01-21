import pool from "../config/db";
import { normalizeValues } from "./repository.utils";
import { ITipoPersona } from "../models/ITipoPersona";
import { CreateTipoPersonaDTO, UpdateTipoPersonaDTO, DeleteTipoPersonaDTO } from "../DTOs/tipoPersona.dto";

export class TipoPersonaRepository {
  private readonly table = "type_person";

  async create(data: CreateTipoPersonaDTO): Promise<ITipoPersona> {
    const result = await pool.query(
      `INSERT INTO type_person (name) VALUES ($1) RETURNING id, name`,
      normalizeValues([data.name])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<ITipoPersona | null> {
    const result = await pool.query(
      `SELECT id, name FROM type_person WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<ITipoPersona[]> {
    const result = await pool.query(`SELECT id, name FROM type_person ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateTipoPersonaDTO): Promise<ITipoPersona | null> {
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
      `UPDATE type_person SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteTipoPersonaDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM type_person WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
