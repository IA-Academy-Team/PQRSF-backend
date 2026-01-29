import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { IChat, IChatSummary, IChatPqrsSummary } from "../models/chat.model";
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

  async findAllSummaries(): Promise<IChatSummary[]> {
    const result = await pool.query(
      `SELECT chat.id,
              chat.mode,
              chat.client_id AS "clientId",
              client.name AS "clientName",
              client.phone_number AS "clientPhone",
              last_message.content AS "lastMessage",
              last_message.created_at AS "lastMessageAt"
       FROM chat
       LEFT JOIN client ON client.id = chat.client_id
       LEFT JOIN LATERAL (
         SELECT content, created_at
         FROM message
         WHERE chat_id = chat.id
         ORDER BY created_at DESC
         LIMIT 1
       ) last_message ON true
       ORDER BY last_message.created_at DESC NULLS LAST, chat.id DESC`
    );
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

  async findAllSummariesByPqrs(): Promise<IChatPqrsSummary[]> {
    const result = await pool.query(
      `SELECT pqrs.id AS "pqrsId",
              pqrs.ticket_number AS "ticketNumber",
              pqrs.pqrs_status_id AS "statusId",
              pqrs.created_at AS "pqrsCreatedAt",
              next_pqrs.created_at AS "pqrsEndAt",
              chat.id,
              chat.mode,
              chat.client_id AS "clientId",
              client.name AS "clientName",
              client.phone_number AS "clientPhone",
              last_message.content AS "lastMessage",
              last_message.created_at AS "lastMessageAt"
       FROM pqrs
       JOIN chat ON chat.client_id = pqrs.client_id
       LEFT JOIN client ON client.id = pqrs.client_id
       LEFT JOIN LATERAL (
         SELECT created_at
         FROM pqrs next_p
         WHERE next_p.client_id = pqrs.client_id
           AND next_p.created_at > pqrs.created_at
         ORDER BY next_p.created_at ASC
         LIMIT 1
       ) next_pqrs ON true
       LEFT JOIN LATERAL (
         SELECT content, created_at
         FROM message
         WHERE chat_id = chat.id
           AND created_at >= pqrs.created_at
           AND (next_pqrs.created_at IS NULL OR created_at < next_pqrs.created_at)
         ORDER BY created_at DESC
         LIMIT 1
       ) last_message ON true
       ORDER BY pqrs.created_at DESC`
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
