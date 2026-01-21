import pool from "../config/db";
import { normalizeValues } from "./repository.utils";
import { IResponsable } from "../models/IResponsable";
import { CreateResponsableDTO, UpdateResponsableDTO, DeleteResponsableDTO } from "../DTOs/responsable.dto";

export class ResponsableRepository {
  private readonly table = "responsible";

  async create(data: CreateResponsableDTO): Promise<IResponsable> {
    const result = await pool.query(
      `INSERT INTO responsible (name, email, password, phone_number, area_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, password, phone_number AS "phoneNumber", area_id AS "areaId"`,
      normalizeValues([data.name, data.email, data.password, data.phoneNumber, data.areaId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IResponsable | null> {
    const result = await pool.query(
      `SELECT id, name, email, password, phone_number AS "phoneNumber", area_id AS "areaId" FROM responsible WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IResponsable[]> {
    const result = await pool.query(`SELECT id, name, email, password, phone_number AS "phoneNumber", area_id AS "areaId" FROM responsible ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateResponsableDTO): Promise<IResponsable | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.name !== undefined) {
      fields.push(`name = $${index}`);
      values.push(data.name);
      index += 1;
    }
    if (data.email !== undefined) {
      fields.push(`email = $${index}`);
      values.push(data.email);
      index += 1;
    }
    if (data.password !== undefined) {
      fields.push(`password = $${index}`);
      values.push(data.password);
      index += 1;
    }
    if (data.phoneNumber !== undefined) {
      fields.push(`phone_number = $${index}`);
      values.push(data.phoneNumber);
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
      `UPDATE responsible SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name, email, password, phone_number AS "phoneNumber", area_id AS "areaId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteResponsableDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM responsible WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
