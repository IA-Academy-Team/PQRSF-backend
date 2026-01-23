import pool from "../config/db.config";
import { normalizeValues } from "../repositories/repository.utils";

export class DashboardService {
  async getAdminMetrics() {
    const totals = await pool.query(
      `SELECT COUNT(*)::int AS total FROM pqrs`
    );
    const byStatus = await pool.query(
      `SELECT pqrs_status_id AS "statusId", COUNT(*)::int AS count FROM pqrs GROUP BY pqrs_status_id ORDER BY pqrs_status_id`
    );
    const chats = await pool.query(`SELECT COUNT(*)::int AS total FROM chat`);
    const clients = await pool.query(`SELECT COUNT(*)::int AS total FROM client`);

    return {
      totalPqrs: totals.rows[0]?.total ?? 0,
      totalChats: chats.rows[0]?.total ?? 0,
      totalClients: clients.rows[0]?.total ?? 0,
      byStatus: byStatus.rows,
    };
  }

  async getAdminChats() {
    const result = await pool.query(
      `SELECT id, mode, client_id AS "clientId" FROM chat ORDER BY id DESC`
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
