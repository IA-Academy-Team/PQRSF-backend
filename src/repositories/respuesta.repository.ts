import pool from "../config/db";
import { normalizeValues } from "./repository.utils";
import { IRespuesta } from "../models/IRespuesta";
import { CreateRespuestaDTO, UpdateRespuestaDTO, DeleteRespuestaDTO } from "../DTOs/respuesta.dto";

export class RespuestaRepository {
  private readonly table = "response";

  async create(data: CreateRespuestaDTO): Promise<IRespuesta> {
    const result = await pool.query(
      `INSERT INTO response (content, channel, document_id, pqrs_id, responsible_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, channel, sent_at AS "sentAt", document_id AS "documentId", pqrs_id AS "pqrsId", responsible_id AS "responsibleId"`,
      normalizeValues([data.content, data.channel, data.documentId, data.pqrsId, data.responsibleId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IRespuesta | null> {
    const result = await pool.query(
      `SELECT id, content, channel, sent_at AS "sentAt", document_id AS "documentId", pqrs_id AS "pqrsId", responsible_id AS "responsibleId" FROM response WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IRespuesta[]> {
    const result = await pool.query(`SELECT id, content, channel, sent_at AS "sentAt", document_id AS "documentId", pqrs_id AS "pqrsId", responsible_id AS "responsibleId" FROM response ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateRespuestaDTO): Promise<IRespuesta | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.content !== undefined) {
      fields.push(`content = $${index}`);
      values.push(data.content);
      index += 1;
    }
    if (data.channel !== undefined) {
      fields.push(`channel = $${index}`);
      values.push(data.channel);
      index += 1;
    }
    if (data.sentAt !== undefined) {
      fields.push(`sent_at = $${index}`);
      values.push(data.sentAt);
      index += 1;
    }
    if (data.documentId !== undefined) {
      fields.push(`document_id = $${index}`);
      values.push(data.documentId);
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
      `UPDATE response SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, content, channel, sent_at AS "sentAt", document_id AS "documentId", pqrs_id AS "pqrsId", responsible_id AS "responsibleId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteRespuestaDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM response WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
