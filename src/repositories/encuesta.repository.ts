import pool from "../config/db";
import { normalizeValues } from "./repository.utils";
import { IEncuesta } from "../models/encuesta.model";
import { CreateEncuestaDTO, UpdateEncuestaDTO, DeleteEncuestaDTO } from "../DTOs/encuesta.dto";

export class EncuestaRepository {
  private readonly table = "survey";

  async create(data: CreateEncuestaDTO): Promise<IEncuesta> {
    const result = await pool.query(
      `INSERT INTO survey (q1_clarity, q2_timeliness, q3_quality, q4_attention, q5_overall, comment, pqrs_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, q1_clarity AS "q1Clarity", q2_timeliness AS "q2Timeliness", q3_quality AS "q3Quality", q4_attention AS "q4Attention", q5_overall AS "q5Overall", comment, pqrs_id AS "pqrsId", created_at AS "createdAt"`,
      normalizeValues([data.q1Clarity, data.q2Timeliness, data.q3Quality, data.q4Attention, data.q5Overall, data.comment, data.pqrsId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IEncuesta | null> {
    const result = await pool.query(
      `SELECT id, q1_clarity AS "q1Clarity", q2_timeliness AS "q2Timeliness", q3_quality AS "q3Quality", q4_attention AS "q4Attention", q5_overall AS "q5Overall", comment, pqrs_id AS "pqrsId", created_at AS "createdAt" FROM survey WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IEncuesta[]> {
    const result = await pool.query(`SELECT id, q1_clarity AS "q1Clarity", q2_timeliness AS "q2Timeliness", q3_quality AS "q3Quality", q4_attention AS "q4Attention", q5_overall AS "q5Overall", comment, pqrs_id AS "pqrsId", created_at AS "createdAt" FROM survey ORDER BY id`);
    return result.rows;
  }

  async findByPqrsId(pqrsId: number): Promise<IEncuesta | null> {
    const result = await pool.query(
      `SELECT id, q1_clarity AS "q1Clarity", q2_timeliness AS "q2Timeliness", q3_quality AS "q3Quality", q4_attention AS "q4Attention", q5_overall AS "q5Overall", comment, pqrs_id AS "pqrsId", created_at AS "createdAt" FROM survey WHERE pqrs_id = $1`,
      normalizeValues([pqrsId])
    );
    return result.rows[0] ?? null;
  }

  async update(data: UpdateEncuestaDTO): Promise<IEncuesta | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.q1Clarity !== undefined) {
      fields.push(`q1_clarity = $${index}`);
      values.push(data.q1Clarity);
      index += 1;
    }
    if (data.q2Timeliness !== undefined) {
      fields.push(`q2_timeliness = $${index}`);
      values.push(data.q2Timeliness);
      index += 1;
    }
    if (data.q3Quality !== undefined) {
      fields.push(`q3_quality = $${index}`);
      values.push(data.q3Quality);
      index += 1;
    }
    if (data.q4Attention !== undefined) {
      fields.push(`q4_attention = $${index}`);
      values.push(data.q4Attention);
      index += 1;
    }
    if (data.q5Overall !== undefined) {
      fields.push(`q5_overall = $${index}`);
      values.push(data.q5Overall);
      index += 1;
    }
    if (data.comment !== undefined) {
      fields.push(`comment = $${index}`);
      values.push(data.comment);
      index += 1;
    }
    if (data.pqrsId !== undefined) {
      fields.push(`pqrs_id = $${index}`);
      values.push(data.pqrsId);
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
      `UPDATE survey SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, q1_clarity AS "q1Clarity", q2_timeliness AS "q2Timeliness", q3_quality AS "q3Quality", q4_attention AS "q4Attention", q5_overall AS "q5Overall", comment, pqrs_id AS "pqrsId", created_at AS "createdAt"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteEncuestaDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM survey WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
