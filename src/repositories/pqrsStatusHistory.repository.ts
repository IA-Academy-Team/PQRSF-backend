import pool from "../config/db.config";
import { IPqrsStatusHistory } from "../models/pqrsStatusHistory.model";
import { normalizeValues } from "../utils/validation.utils";

export class PqrsStatusHistoryRepository {
  async create(data: {
    pqrsId: number;
    statusId: number;
    createdAt?: Date;
    note?: string | null;
  }): Promise<IPqrsStatusHistory> {
    const result = await pool.query(
      `INSERT INTO pqrs_status_history (pqrs_id, status_id, created_at, note)
       VALUES ($1, $2, COALESCE($3, NOW()), $4)
       RETURNING id, pqrs_id AS "pqrsId", status_id AS "statusId", created_at AS "createdAt", note`,
      normalizeValues([data.pqrsId, data.statusId, data.createdAt ?? null, data.note ?? null])
    );
    return result.rows[0];
  }

  async listByPqrsId(pqrsId: number): Promise<IPqrsStatusHistory[]> {
    const result = await pool.query(
      `SELECT h.id,
              h.pqrs_id AS "pqrsId",
              h.status_id AS "statusId",
              s.name AS "statusName",
              h.created_at AS "createdAt",
              h.note
       FROM pqrs_status_history h
       JOIN pqrs_status s ON s.id = h.status_id
       WHERE pqrs_id = $1
       ORDER BY created_at ASC, id ASC`,
      normalizeValues([pqrsId])
    );
    return result.rows ?? [];
  }
}
