import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { ITipoDocumento } from "../models/tipoDocumento.model";
import { CreateTipoDocumentoDTO, UpdateTipoDocumentoDTO, DeleteTipoDocumentoDTO } from "../DTOs/tipoDocumento.dto";

export class TipoDocumentoRepository {
  private readonly table = "type_document";

  async create(data: CreateTipoDocumentoDTO): Promise<ITipoDocumento> {
    const result = await pool.query(
      `INSERT INTO type_document (name) VALUES ($1) RETURNING id, name`,
      normalizeValues([data.name])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<ITipoDocumento | null> {
    const result = await pool.query(
      `SELECT id, name FROM type_document WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<ITipoDocumento[]> {
    const result = await pool.query(`SELECT id, name FROM type_document ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateTipoDocumentoDTO): Promise<ITipoDocumento | null> {
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
      `UPDATE type_document SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteTipoDocumentoDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM type_document WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
