import pool from "../config/db";
import { normalizeValues } from "./repository.utils";
import { IAnalisis } from "../models/IAnalisis";
import { CreateAnalisisDTO, UpdateAnalisisDTO, DeleteAnalisisDTO } from "../DTOs/analisis.dto";

export class AnalisisRepository {
  private readonly table = "analysis";

  async create(data: CreateAnalisisDTO): Promise<IAnalisis> {
    const result = await pool.query(
      `INSERT INTO analysis (answer, action_taken, pqrs_id, responsible_id) VALUES ($1, $2, $3, $4) RETURNING id, answer, action_taken AS "actionTaken", created_at AS "createdAt", pqrs_id AS "pqrsId", responsible_id AS "responsibleId"`,
      normalizeValues([data.answer, data.actionTaken, data.pqrsId, data.responsibleId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IAnalisis | null> {
    const result = await pool.query(
      `SELECT id, answer, action_taken AS "actionTaken", created_at AS "createdAt", pqrs_id AS "pqrsId", responsible_id AS "responsibleId" FROM analysis WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IAnalisis[]> {
    const result = await pool.query(`SELECT id, answer, action_taken AS "actionTaken", created_at AS "createdAt", pqrs_id AS "pqrsId", responsible_id AS "responsibleId" FROM analysis ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateAnalisisDTO): Promise<IAnalisis | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.answer !== undefined) {
      fields.push(`answer = $${index}`);
      values.push(data.answer);
      index += 1;
    }
    if (data.actionTaken !== undefined) {
      fields.push(`action_taken = $${index}`);
      values.push(data.actionTaken);
      index += 1;
    }
    if (data.createdAt !== undefined) {
      fields.push(`created_at = $${index}`);
      values.push(data.createdAt);
      index += 1;
    }
    if (data.pqrsId !== undefined) {
      fields.push(`pqrs_id = $${index}`);
      values.push(data.pqrsId);
      index += 1;
    }
    if (data.responsibleId !== undefined) {
      fields.push(`responsible_id = $${index}`);
      values.push(data.responsibleId);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE analysis SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, answer, action_taken AS "actionTaken", created_at AS "createdAt", pqrs_id AS "pqrsId", responsible_id AS "responsibleId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteAnalisisDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM analysis WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
