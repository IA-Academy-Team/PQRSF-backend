import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { IReanalisis } from "../models/reanalisis.model";
import { CreateReanalisisDTO, UpdateReanalisisDTO, DeleteReanalisisDTO } from "../schemas/reanalisis.schema";

export class ReanalisisRepository {
  private readonly table = "reanalysis";

  async create(data: CreateReanalisisDTO): Promise<IReanalisis> {
    const result = await pool.query(
      `INSERT INTO reanalysis (answer, action_taken, analysis_id, responsible_id) VALUES ($1, $2, $3, $4) RETURNING id, answer, action_taken AS "actionTaken", created_at AS "createdAt", analysis_id AS "analysisId", responsible_id AS "responsibleId"`,
      normalizeValues([data.answer, data.actionTaken, data.analysisId, data.responsibleId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IReanalisis | null> {
    const result = await pool.query(
      `SELECT id, answer, action_taken AS "actionTaken", created_at AS "createdAt", analysis_id AS "analysisId", responsible_id AS "responsibleId" FROM reanalysis WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IReanalisis[]> {
    const result = await pool.query(`SELECT id, answer, action_taken AS "actionTaken", created_at AS "createdAt", analysis_id AS "analysisId", responsible_id AS "responsibleId" FROM reanalysis ORDER BY id`);
    return result.rows;
  }

  async findByAnalysisId(analysisId: number): Promise<IReanalisis | null> {
    const result = await pool.query(
      `SELECT id, answer, action_taken AS "actionTaken", created_at AS "createdAt", analysis_id AS "analysisId", responsible_id AS "responsibleId" FROM reanalysis WHERE analysis_id = $1`,
      normalizeValues([analysisId])
    );
    return result.rows[0] ?? null;
  }

  async update(data: UpdateReanalisisDTO): Promise<IReanalisis | null> {
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
    if (data.analysisId !== undefined) {
      fields.push(`analysis_id = $${index}`);
      values.push(data.analysisId);
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
      `UPDATE reanalysis SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, answer, action_taken AS "actionTaken", created_at AS "createdAt", analysis_id AS "analysisId", responsible_id AS "responsibleId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteReanalisisDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM reanalysis WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
