import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { IChat } from "../models/chat.model";
import { CreateChatDTO, UpdateChatDTO, DeleteChatDTO } from "../schemas/chat.schema";

export class ChatRepository {
  private readonly table = "chat";

  async create(data: CreateChatDTO): Promise<IChat> {
    const result = await pool.query(
      `INSERT INTO chat (id, mode, client_id) VALUES ($1, $2, $3) RETURNING id, mode, client_id AS "clientId"`,
      normalizeValues([data.id, data.mode, data.clientId])
    );
    return result.rows[0];
  }

  async findById(id: bigint): Promise<IChat | null> {
    const result = await pool.query(
      `SELECT id, mode, client_id AS "clientId" FROM chat WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IChat[]> {
    const result = await pool.query(`SELECT id, mode, client_id AS "clientId" FROM chat ORDER BY id`);
    return result.rows;
  }

  async findByClientId(clientId: bigint): Promise<IChat | null> {
    const result = await pool.query(
      `SELECT id, mode, client_id AS "clientId" FROM chat WHERE client_id = $1`,
      normalizeValues([clientId])
    );
    return result.rows[0] ?? null;
  }

  async findByAreaId(areaId: number): Promise<IChat[]> {
    const result = await pool.query(
      `SELECT DISTINCT chat.id, chat.mode, chat.client_id AS "clientId"
       FROM chat
       JOIN pqrs ON pqrs.client_id = chat.client_id
       WHERE pqrs.area_id = $1
       ORDER BY chat.id`,
      normalizeValues([areaId])
    );
    return result.rows;
  }

  async update(data: UpdateChatDTO): Promise<IChat | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.mode !== undefined) {
      fields.push(`mode = $${index}`);
      values.push(data.mode);
      index += 1;
    }
    if (data.clientId !== undefined) {
      fields.push(`client_id = $${index}`);
      values.push(data.clientId);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as bigint);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE chat SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, mode, client_id AS "clientId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteChatDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM chat WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
