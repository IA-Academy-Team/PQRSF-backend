import pool from "../config/db";
import { normalizeValues } from "./repository.utils";
import { IMensaje } from "../models/IMensaje";
import { CreateMensajeDTO, UpdateMensajeDTO, DeleteMensajeDTO } from "../DTOs/mensaje.dto";

export class MensajeRepository {
  private readonly table = "message";

  async create(data: CreateMensajeDTO): Promise<IMensaje> {
    const result = await pool.query(
      `INSERT INTO message (content, type, chat_id) VALUES ($1, $2, $3) RETURNING id, content, type, created_at AS "createdAt", chat_id AS "chatId"`,
      normalizeValues([data.content, data.type, data.chatId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IMensaje | null> {
    const result = await pool.query(
      `SELECT id, content, type, created_at AS "createdAt", chat_id AS "chatId" FROM message WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IMensaje[]> {
    const result = await pool.query(`SELECT id, content, type, created_at AS "createdAt", chat_id AS "chatId" FROM message ORDER BY id`);
    return result.rows;
  }

  async findByChatId(chatId: bigint): Promise<IMensaje[]> {
    const result = await pool.query(
      `SELECT id, content, type, created_at AS "createdAt", chat_id AS "chatId" FROM message WHERE chat_id = $1 ORDER BY created_at`,
      normalizeValues([chatId])
    );
    return result.rows;
  }

  async update(data: UpdateMensajeDTO): Promise<IMensaje | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.content !== undefined) {
      fields.push(`content = $${index}`);
      values.push(data.content);
      index += 1;
    }
    if (data.type !== undefined) {
      fields.push(`type = $${index}`);
      values.push(data.type);
      index += 1;
    }
    if (data.createdAt !== undefined) {
      fields.push(`created_at = $${index}`);
      values.push(data.createdAt);
      index += 1;
    }
    if (data.chatId !== undefined) {
      fields.push(`chat_id = $${index}`);
      values.push(data.chatId);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE message SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, content, type, created_at AS "createdAt", chat_id AS "chatId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteMensajeDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM message WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
