import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { INotificacion } from "../models/notificacion.model";
import { CreateNotificacionDTO, UpdateNotificacionDTO, DeleteNotificacionDTO } from "../schemas/notificacion.schema";

export class NotificacionRepository {
  private readonly table = "notification";

  async create(data: CreateNotificacionDTO): Promise<INotificacion> {
    const result = await pool.query(
      `INSERT INTO notification (message, status, responsible_id, pqrs_id) VALUES ($1, $2, $3, $4) RETURNING id, message, status, responsible_id AS "responsibleId", pqrs_id AS "pqrsId", created_at AS "createdAt"`,
      normalizeValues([data.message, data.status, data.responsibleId, data.pqrsId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<INotificacion | null> {
    const result = await pool.query(
      `SELECT id, message, status, responsible_id AS "responsibleId", pqrs_id AS "pqrsId", created_at AS "createdAt" FROM notification WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<INotificacion[]> {
    const result = await pool.query(`SELECT id, message, status, responsible_id AS "responsibleId", pqrs_id AS "pqrsId", created_at AS "createdAt" FROM notification ORDER BY id`);
    return result.rows;
  }

  async findByResponsibleId(responsibleId: number): Promise<INotificacion[]> {
    const result = await pool.query(
      `SELECT id, message, status, responsible_id AS "responsibleId", pqrs_id AS "pqrsId", created_at AS "createdAt" FROM notification WHERE responsible_id = $1 ORDER BY created_at DESC`,
      normalizeValues([responsibleId])
    );
    return result.rows;
  }

  async countUnread(responsibleId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM notification WHERE responsible_id = $1 AND status = 1`,
      normalizeValues([responsibleId])
    );
    return result.rows[0]?.count ?? 0;
  }

  async markAsRead(ids: number[]): Promise<number> {
    if (ids.length === 0) {
      return 0;
    }
    const result = await pool.query(
      `UPDATE notification SET status = 2 WHERE id = ANY($1::int[])`,
      [ids]
    );
    return result.rowCount ?? 0;
  }

  async update(data: UpdateNotificacionDTO): Promise<INotificacion | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.message !== undefined) {
      fields.push(`message = $${index}`);
      values.push(data.message);
      index += 1;
    }
    if (data.status !== undefined) {
      fields.push(`status = $${index}`);
      values.push(data.status);
      index += 1;
    }
    if (data.responsibleId !== undefined) {
      fields.push(`responsible_id = $${index}`);
      values.push(data.responsibleId);
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
      `UPDATE notification SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, message, status, responsible_id AS "responsibleId", pqrs_id AS "pqrsId", created_at AS "createdAt"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteNotificacionDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM notification WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
