import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { IResponsable } from "../models/responsable.model";
import { CreateResponsableDTO, UpdateResponsableDTO, DeleteResponsableDTO } from "../schemas/responsable.schema";

export class ResponsableRepository {
  private readonly table = "responsible";

  async create(data: CreateResponsableDTO): Promise<IResponsable> {
    const result = await pool.query(
      `INSERT INTO responsible (user_id, area_id) VALUES ($1, $2) RETURNING id, user_id AS "userId", area_id AS "areaId"`,
      normalizeValues([data.userId, data.areaId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IResponsable | null> {
    const result = await pool.query(
      `SELECT id, user_id AS "userId", area_id AS "areaId" FROM responsible WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IResponsable[]> {
    const result = await pool.query(
      `SELECT id, user_id AS "userId", area_id AS "areaId" FROM responsible ORDER BY id`
    );
    return result.rows;
  }

  async findByUserId(userId: number): Promise<IResponsable | null> {
    const result = await pool.query(
      `SELECT id, user_id AS "userId", area_id AS "areaId" FROM responsible WHERE user_id = $1`,
      normalizeValues([userId])
    );
    return result.rows[0] ?? null;
  }

  async findByAreaId(areaId: number): Promise<IResponsable[]> {
    const result = await pool.query(
      `SELECT id, user_id AS "userId", area_id AS "areaId" FROM responsible WHERE area_id = $1 ORDER BY id`,
      normalizeValues([areaId])
    );
    return result.rows;
  }

  async update(data: UpdateResponsableDTO): Promise<IResponsable | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.userId !== undefined) {
      fields.push(`user_id = $${index}`);
      values.push(data.userId);
      index += 1;
    }
    if (data.areaId !== undefined) {
      fields.push(`area_id = $${index}`);
      values.push(data.areaId);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE responsible SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, user_id AS "userId", area_id AS "areaId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteResponsableDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM responsible WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
