import pool from "../config/db";
import { normalizeValues } from "./repository.utils";
import { IStakeholder } from "../models/IStakeholder";
import { CreateStakeholderDTO, UpdateStakeholderDTO, DeleteStakeholderDTO } from "../DTOs/stakeholder.dto";

export class StakeholderRepository {
  private readonly table = "stakeholder";

  async create(data: CreateStakeholderDTO): Promise<IStakeholder> {
    const result = await pool.query(
      `INSERT INTO stakeholder (name) VALUES ($1) RETURNING id, name`,
      normalizeValues([data.name])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IStakeholder | null> {
    const result = await pool.query(
      `SELECT id, name FROM stakeholder WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IStakeholder[]> {
    const result = await pool.query(`SELECT id, name FROM stakeholder ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateStakeholderDTO): Promise<IStakeholder | null> {
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
      `UPDATE stakeholder SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteStakeholderDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM stakeholder WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
