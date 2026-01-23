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
