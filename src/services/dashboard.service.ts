import pool from "../config/db.config";
import { normalizeValues } from "../repositories/repository.utils";

export class DashboardService {
  async getAdminMetrics() {
    const totals = await pool.query(
      `SELECT COUNT(*)::int AS total FROM pqrs`
    );
    const byStatus = await pool.query(
      `SELECT p.pqrs_status_id AS "statusId", s.name AS "statusName", COUNT(*)::int AS count
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       GROUP BY p.pqrs_status_id, s.name
       ORDER BY p.pqrs_status_id`
    );
    const byType = await pool.query(
      `SELECT t.id AS "typeId", t.name AS "typeName", COUNT(*)::int AS count
       FROM pqrs p
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       GROUP BY t.id, t.name
       ORDER BY t.id`
    );
    const avgResponseByArea = await pool.query(
      `SELECT a.id AS "areaId", a.name AS "areaName",
              COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (p.updated_at - p.created_at)) / 86400)::numeric, 1), 0) AS "avgDays"
       FROM pqrs p
       JOIN area a ON a.id = p.area_id
       WHERE p.pqrs_status_id = 4
       GROUP BY a.id, a.name
       ORDER BY "avgDays" ASC`
    );
    const chats = await pool.query(`SELECT COUNT(*)::int AS total FROM chat`);
    const clients = await pool.query(`SELECT COUNT(*)::int AS total FROM client`);

    return {
      totalPqrs: totals.rows[0]?.total ?? 0,
      totalChats: chats.rows[0]?.total ?? 0,
      totalClients: clients.rows[0]?.total ?? 0,
      byStatus: byStatus.rows,
      byType: byType.rows,
      avgResponseByArea: avgResponseByArea.rows,
    };
  }

  async getAdminChats() {
    const result = await pool.query(
      `SELECT c.id AS "chatId",
              c.mode,
              c.client_id AS "clientId",
              cl.name AS "clientName",
              m.content AS "lastMessage",
              m.created_at AS "lastMessageAt",
              p.ticket_number AS "ticketNumber"
       FROM chat c
       LEFT JOIN client cl ON cl.id = c.client_id
       LEFT JOIN LATERAL (
         SELECT content, created_at
         FROM message
         WHERE chat_id = c.id
         ORDER BY created_at DESC
         LIMIT 1
       ) m ON true
       LEFT JOIN LATERAL (
         SELECT ticket_number
         FROM pqrs
         WHERE client_id = c.client_id
         ORDER BY created_at DESC
         LIMIT 1
       ) p ON true
       ORDER BY c.id DESC
       LIMIT 10`
    );
    return result.rows;
  }

  async getAreaMetrics(areaId: number) {
    const totals = await pool.query(
      `SELECT COUNT(*)::int AS total FROM pqrs WHERE area_id = $1`,
      normalizeValues([areaId])
    );
    const byStatus = await pool.query(
      `SELECT pqrs_status_id AS "statusId", COUNT(*)::int AS count FROM pqrs WHERE area_id = $1 GROUP BY pqrs_status_id ORDER BY pqrs_status_id`,
      normalizeValues([areaId])
    );
    return {
      totalPqrs: totals.rows[0]?.total ?? 0,
      byStatus: byStatus.rows,
    };
  }

  async getAreaPending(areaId: number) {
    const result = await pool.query(
      `SELECT id, ticket_number AS "ticketNumber", is_auto_resolved AS "isAutoResolved", due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt", pqrs_status_id AS "pqrsStatusId", client_id AS "clientId", type_pqrs_id AS "typePqrsId", area_id AS "areaId"
       FROM pqrs
       WHERE area_id = $1 AND pqrs_status_id != 4
       ORDER BY id`,
      normalizeValues([areaId])
    );
    return result.rows;
  }

  async getAreaAppeals(areaId: number) {
    const result = await pool.query(
      `SELECT id, ticket_number AS "ticketNumber", is_auto_resolved AS "isAutoResolved", due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt", pqrs_status_id AS "pqrsStatusId", client_id AS "clientId", type_pqrs_id AS "typePqrsId", area_id AS "areaId"
       FROM pqrs
       WHERE area_id = $1 AND pqrs_status_id = 3
       ORDER BY id`,
      normalizeValues([areaId])
    );
    return result.rows;
  }
}
