import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { IPqrs } from "../models/pqrs.model";
import { CreatePqrsDTO, UpdatePqrsDTO, DeletePqrsDTO } from "../schemas/pqrs.schema";

export interface PqrsFilters {
  pqrsStatusId?: number;
  areaId?: number;
  typePqrsId?: number;
  clientId?: bigint;
  ticketNumber?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface PqrsDetailedFilters extends PqrsFilters {
  q?: string;
  sort?: "recent" | "oldest" | "ticket";
}

export class PqrsRepository {
  private readonly table = "pqrs";

  async create(data: CreatePqrsDTO): Promise<IPqrs> {
    const result = await pool.query(
      `INSERT INTO pqrs (ticket_number, is_auto_resolved, due_date, pqrs_status_id, client_id, type_pqrs_id, area_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, ticket_number AS "ticketNumber", is_auto_resolved AS "isAutoResolved", due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt", pqrs_status_id AS "pqrsStatusId", client_id AS "clientId", type_pqrs_id AS "typePqrsId", area_id AS "areaId"`,
      normalizeValues([data.ticketNumber, data.isAutoResolved, data.dueDate, data.pqrsStatusId, data.clientId, data.typePqrsId, data.areaId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IPqrs | null> {
    const result = await pool.query(
      `SELECT id, ticket_number AS "ticketNumber", is_auto_resolved AS "isAutoResolved", due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt", pqrs_status_id AS "pqrsStatusId", client_id AS "clientId", type_pqrs_id AS "typePqrsId", area_id AS "areaId" FROM pqrs WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IPqrs[]> {
    const result = await pool.query(`SELECT id, ticket_number AS "ticketNumber", is_auto_resolved AS "isAutoResolved", due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt", pqrs_status_id AS "pqrsStatusId", client_id AS "clientId", type_pqrs_id AS "typePqrsId", area_id AS "areaId" FROM pqrs ORDER BY id`);
    return result.rows;
  }

  async findByTicketNumber(ticketNumber: string): Promise<IPqrs | null> {
    const result = await pool.query(
      `SELECT id, ticket_number AS "ticketNumber", is_auto_resolved AS "isAutoResolved", due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt", pqrs_status_id AS "pqrsStatusId", client_id AS "clientId", type_pqrs_id AS "typePqrsId", area_id AS "areaId" FROM pqrs WHERE ticket_number = $1`,
      normalizeValues([ticketNumber])
    );
    return result.rows[0] ?? null;
  }

  async findAllWithFilters(filters: PqrsFilters): Promise<IPqrs[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (filters.pqrsStatusId !== undefined) {
      conditions.push(`pqrs_status_id = $${index}`);
      values.push(filters.pqrsStatusId);
      index += 1;
    }
    if (filters.areaId !== undefined) {
      conditions.push(`area_id = $${index}`);
      values.push(filters.areaId);
      index += 1;
    }
    if (filters.typePqrsId !== undefined) {
      conditions.push(`type_pqrs_id = $${index}`);
      values.push(filters.typePqrsId);
      index += 1;
    }
    if (filters.clientId !== undefined) {
      conditions.push(`client_id = $${index}`);
      values.push(filters.clientId);
      index += 1;
    }
    if (filters.ticketNumber !== undefined) {
      conditions.push(`ticket_number = $${index}`);
      values.push(filters.ticketNumber);
      index += 1;
    }
    if (filters.fromDate !== undefined) {
      conditions.push(`created_at >= $${index}`);
      values.push(filters.fromDate);
      index += 1;
    }
    if (filters.toDate !== undefined) {
      conditions.push(`created_at <= $${index}`);
      values.push(filters.toDate);
      index += 1;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await pool.query(
      `SELECT id, ticket_number AS "ticketNumber", is_auto_resolved AS "isAutoResolved", due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt", pqrs_status_id AS "pqrsStatusId", client_id AS "clientId", type_pqrs_id AS "typePqrsId", area_id AS "areaId" FROM pqrs ${where} ORDER BY id`,
      normalizeValues(values)
    );
    return result.rows;
  }

  async findSeguimientoDetailed() {
    const result = await pool.query(
      `SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.created_at AS "createdAt",
              p.pqrs_status_id AS "statusId",
              s.name AS "statusName",
              t.name AS "typeName",
              a.name AS "areaName",
              c.name AS "clientName",
              r.content AS "responseContent",
              r.sent_at AS "responseSentAt",
              sv.q1_clarity AS "q1Clarity",
              sv.q2_timeliness AS "q2Timeliness",
              sv.q3_quality AS "q3Quality",
              sv.q4_attention AS "q4Attention",
              sv.q5_overall AS "q5Overall",
              sv.comment AS "surveyComment"
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       JOIN client c ON c.id = p.client_id
       LEFT JOIN LATERAL (
         SELECT content, sent_at
         FROM response
         WHERE pqrs_id = p.id
         ORDER BY sent_at DESC
         LIMIT 1
       ) r ON true
       LEFT JOIN survey sv ON sv.pqrs_id = p.id
       WHERE p.pqrs_status_id = 2
       ORDER BY p.created_at DESC`
    );
    return result.rows;
  }

  async findApelacionesDetailed() {
    const result = await pool.query(
      `SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.created_at AS "createdAt",
              p.pqrs_status_id AS "statusId",
              s.name AS "statusName",
              t.name AS "typeName",
              a.name AS "areaName",
              c.name AS "clientName",
              r.content AS "responseContent",
              r.sent_at AS "responseSentAt",
              sv.comment AS "surveyComment"
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       JOIN client c ON c.id = p.client_id
       LEFT JOIN LATERAL (
         SELECT content, sent_at
         FROM response
         WHERE pqrs_id = p.id
         ORDER BY sent_at DESC
         LIMIT 1
       ) r ON true
       LEFT JOIN survey sv ON sv.pqrs_id = p.id
       WHERE p.pqrs_status_id = 3
       ORDER BY p.created_at DESC`
    );
    return result.rows;
  }

  async findCerradasDetailed() {
    const result = await pool.query(
      `SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.created_at AS "createdAt",
              p.updated_at AS "updatedAt",
              p.pqrs_status_id AS "statusId",
              s.name AS "statusName",
              t.name AS "typeName",
              a.name AS "areaName",
              c.name AS "clientName",
              r.content AS "responseContent",
              r.sent_at AS "responseSentAt",
              sv.q1_clarity AS "q1Clarity",
              sv.q2_timeliness AS "q2Timeliness",
              sv.q3_quality AS "q3Quality",
              sv.q4_attention AS "q4Attention",
              sv.q5_overall AS "q5Overall",
              sv.comment AS "surveyComment"
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       JOIN client c ON c.id = p.client_id
       LEFT JOIN LATERAL (
         SELECT content, sent_at
         FROM response
         WHERE pqrs_id = p.id
         ORDER BY sent_at DESC
         LIMIT 1
       ) r ON true
       LEFT JOIN survey sv ON sv.pqrs_id = p.id
       WHERE p.pqrs_status_id = 4
       ORDER BY p.updated_at DESC`
    );
    return result.rows;
  }

  async findAllDetailed(filters: PqrsDetailedFilters) {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (filters.pqrsStatusId !== undefined) {
      conditions.push(`p.pqrs_status_id = $${index}`);
      values.push(filters.pqrsStatusId);
      index += 1;
    }
    if (filters.areaId !== undefined) {
      conditions.push(`p.area_id = $${index}`);
      values.push(filters.areaId);
      index += 1;
    }
    if (filters.typePqrsId !== undefined) {
      conditions.push(`p.type_pqrs_id = $${index}`);
      values.push(filters.typePqrsId);
      index += 1;
    }
    if (filters.clientId !== undefined) {
      conditions.push(`p.client_id = $${index}`);
      values.push(filters.clientId);
      index += 1;
    }
    if (filters.ticketNumber !== undefined) {
      conditions.push(`p.ticket_number = $${index}`);
      values.push(filters.ticketNumber);
      index += 1;
    }
    if (filters.fromDate !== undefined) {
      conditions.push(`p.created_at >= $${index}`);
      values.push(filters.fromDate);
      index += 1;
    }
    if (filters.toDate !== undefined) {
      conditions.push(`p.created_at <= $${index}`);
      values.push(filters.toDate);
      index += 1;
    }
    if (filters.q !== undefined) {
      conditions.push(
        `(p.ticket_number ILIKE $${index} OR p.description ILIKE $${index} OR c.name ILIKE $${index} OR c.email ILIKE $${index})`
      );
      values.push(`%${filters.q}%`);
      index += 1;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderBy = (() => {
      switch (filters.sort) {
        case "oldest":
          return "p.created_at ASC";
        case "ticket":
          return "p.ticket_number ASC";
        default:
          return "p.created_at DESC";
      }
    })();

    const result = await pool.query(
      `SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
              p.created_at AS "createdAt",
              s.id AS "statusId",
              s.name AS "statusName",
              t.id AS "typeId",
              t.name AS "typeName",
              a.id AS "areaId",
              a.name AS "areaName",
              c.id AS "clientId",
              c.name AS "clientName",
              c.email AS "clientEmail"
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       JOIN client c ON c.id = p.client_id
       ${where}
       ORDER BY ${orderBy}`,
      normalizeValues(values)
    );
    return result.rows;
  }

  async findDetailedById(id: number) {
    const result = await pool.query(
      `SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
              p.is_auto_resolved AS "isAutoResolved",
              p.due_date AS "dueDate",
              p.created_at AS "createdAt",
              p.updated_at AS "updatedAt",
              s.id AS "statusId",
              s.name AS "statusName",
              t.id AS "typeId",
              t.name AS "typeName",
              a.id AS "areaId",
              a.name AS "areaName",
              c.id AS "clientId",
              c.name AS "clientName",
              c.email AS "clientEmail",
              c.document AS "clientDocument",
              c.phone_number AS "clientPhone",
              tp.id AS "typePersonId",
              tp.name AS "typePersonName",
              sh.id AS "stakeholderId",
              sh.name AS "stakeholderName"
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       JOIN client c ON c.id = p.client_id
       LEFT JOIN type_person tp ON tp.id = c.type_person_id
       LEFT JOIN stakeholder sh ON sh.id = c.stakeholder_id
       WHERE p.id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findDetailedByTicketNumber(ticketNumber: string) {
    const result = await pool.query(
      `SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
              p.is_auto_resolved AS "isAutoResolved",
              p.due_date AS "dueDate",
              p.created_at AS "createdAt",
              p.updated_at AS "updatedAt",
              s.id AS "statusId",
              s.name AS "statusName",
              t.id AS "typeId",
              t.name AS "typeName",
              a.id AS "areaId",
              a.name AS "areaName",
              c.id AS "clientId",
              c.name AS "clientName",
              c.email AS "clientEmail",
              c.document AS "clientDocument",
              c.phone_number AS "clientPhone",
              tp.id AS "typePersonId",
              tp.name AS "typePersonName",
              sh.id AS "stakeholderId",
              sh.name AS "stakeholderName"
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       JOIN client c ON c.id = p.client_id
       LEFT JOIN type_person tp ON tp.id = c.type_person_id
       LEFT JOIN stakeholder sh ON sh.id = c.stakeholder_id
       WHERE p.ticket_number = $1`,
      normalizeValues([ticketNumber])
    );
    return result.rows[0] ?? null;
  }

  async findBotResponseByTicketNumber(ticketNumber: string) {
    const result = await pool.query(
      `SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
              p.updated_at AS "updatedAt",
              s.name AS "statusName",
              t.name AS "typeName",
              a.name AS "areaName",
              c.name AS "clientName",
              tp.name AS "typePersonName",
              resp.content AS "responseContent",
              resp.sent_at AS "responseSentAt",
              resp.channel AS "responseChannel",
              resp.responsible_id AS "responseResponsibleId",
              resp_user.name AS "responsibleName",
              resp_user.email AS "responsibleEmail",
              resp_area.name AS "responsibleAreaName",
              chat.id AS "chatId",
              analysis.id AS "analysisId",
              analysis.action_taken AS "analysisActionTaken",
              reanalysis.action_taken AS "reanalysisActionTaken"
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       JOIN client c ON c.id = p.client_id
       LEFT JOIN type_person tp ON tp.id = c.type_person_id
       LEFT JOIN LATERAL (
         SELECT content, sent_at, channel, responsible_id
         FROM response
         WHERE pqrs_id = p.id
         ORDER BY sent_at DESC NULLS LAST, id DESC
         LIMIT 1
       ) resp ON true
       LEFT JOIN responsible r ON r.id = resp.responsible_id
       LEFT JOIN users resp_user ON resp_user.id = r.user_id
       LEFT JOIN area resp_area ON resp_area.id = r.area_id
       LEFT JOIN LATERAL (
         SELECT id, action_taken
         FROM analysis
         WHERE pqrs_id = p.id
         ORDER BY created_at DESC NULLS LAST, id DESC
         LIMIT 1
       ) analysis ON true
       LEFT JOIN LATERAL (
         SELECT action_taken
         FROM reanalysis
         WHERE analysis_id = analysis.id
         ORDER BY created_at DESC NULLS LAST, id DESC
         LIMIT 1
       ) reanalysis ON true
       LEFT JOIN chat ON chat.client_id = p.client_id
       WHERE p.ticket_number = $1`,
      normalizeValues([ticketNumber])
    );
    return result.rows[0] ?? null;
  }

  async findBotResponseByPqrsId(pqrsId: number) {
    const result = await pool.query(
      `SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
              p.updated_at AS "updatedAt",
              s.name AS "statusName",
              t.name AS "typeName",
              a.name AS "areaName",
              c.name AS "clientName",
              tp.name AS "typePersonName",
              resp.content AS "responseContent",
              resp.sent_at AS "responseSentAt",
              resp.channel AS "responseChannel",
              resp.responsible_id AS "responseResponsibleId",
              resp_user.name AS "responsibleName",
              resp_user.email AS "responsibleEmail",
              resp_area.name AS "responsibleAreaName",
              chat.id AS "chatId",
              analysis.id AS "analysisId",
              analysis.action_taken AS "analysisActionTaken",
              reanalysis.action_taken AS "reanalysisActionTaken"
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       JOIN client c ON c.id = p.client_id
       LEFT JOIN type_person tp ON tp.id = c.type_person_id
       LEFT JOIN LATERAL (
         SELECT content, sent_at, channel, responsible_id
         FROM response
         WHERE pqrs_id = p.id
         ORDER BY sent_at DESC NULLS LAST, id DESC
         LIMIT 1
       ) resp ON true
       LEFT JOIN responsible r ON r.id = resp.responsible_id
       LEFT JOIN users resp_user ON resp_user.id = r.user_id
       LEFT JOIN area resp_area ON resp_area.id = r.area_id
       LEFT JOIN LATERAL (
         SELECT id, action_taken
         FROM analysis
         WHERE pqrs_id = p.id
         ORDER BY created_at DESC NULLS LAST, id DESC
         LIMIT 1
       ) analysis ON true
       LEFT JOIN LATERAL (
         SELECT action_taken
         FROM reanalysis
         WHERE analysis_id = analysis.id
         ORDER BY created_at DESC NULLS LAST, id DESC
         LIMIT 1
       ) reanalysis ON true
       LEFT JOIN chat ON chat.client_id = p.client_id
       WHERE p.id = $1`,
      normalizeValues([pqrsId])
    );
    return result.rows[0] ?? null;
  }

  async update(data: UpdatePqrsDTO): Promise<IPqrs | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.ticketNumber !== undefined) {
      fields.push(`ticket_number = $${index}`);
      values.push(data.ticketNumber);
      index += 1;
    }
    if (data.isAutoResolved !== undefined) {
      fields.push(`is_auto_resolved = $${index}`);
      values.push(data.isAutoResolved);
      index += 1;
    }
    if (data.dueDate !== undefined) {
      fields.push(`due_date = $${index}`);
      values.push(data.dueDate);
      index += 1;
    }
    if (data.createdAt !== undefined) {
      fields.push(`created_at = $${index}`);
      values.push(data.createdAt);
      index += 1;
    }
    if (data.updatedAt !== undefined) {
      fields.push(`updated_at = $${index}`);
      values.push(data.updatedAt);
      index += 1;
    }
    if (data.pqrsStatusId !== undefined) {
      fields.push(`pqrs_status_id = $${index}`);
      values.push(data.pqrsStatusId);
      index += 1;
    }
    if (data.clientId !== undefined) {
      fields.push(`client_id = $${index}`);
      values.push(data.clientId);
      index += 1;
    }
    if (data.typePqrsId !== undefined) {
      fields.push(`type_pqrs_id = $${index}`);
      values.push(data.typePqrsId);
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
      `UPDATE pqrs SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, ticket_number AS "ticketNumber", is_auto_resolved AS "isAutoResolved", due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt", pqrs_status_id AS "pqrsStatusId", client_id AS "clientId", type_pqrs_id AS "typePqrsId", area_id AS "areaId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeletePqrsDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM pqrs WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
