import prisma from "../config/db.config";
import { IPqrs } from "../models/pqrs.model";
import { CreatePqrsDTO, UpdatePqrsDTO, DeletePqrsDTO } from "../schemas/pqrs.schema";

const pqrsSelect = {
  id: true,
  ticketNumber: true,
  isAutoResolved: true,
  dueDate: true,
  appeal: true,
  createdAt: true,
  updatedAt: true,
  pqrsStatusId: true,
  clientId: true,
  typePqrsId: true,
  areaId: true,
} as const;

const toPqrs = (row: {
  id: number;
  ticketNumber: string;
  isAutoResolved: boolean | null;
  dueDate: Date | null;
  appeal: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  pqrsStatusId: number;
  clientId: bigint;
  typePqrsId: number;
  areaId: number;
}): IPqrs => ({
  id: row.id,
  ticketNumber: row.ticketNumber,
  isAutoResolved: row.isAutoResolved ?? false,
  dueDate: row.dueDate,
  appeal: row.appeal,
  createdAt: row.createdAt ?? new Date(),
  updatedAt: row.updatedAt ?? new Date(),
  pqrsStatusId: row.pqrsStatusId,
  clientId: row.clientId,
  typePqrsId: row.typePqrsId,
  areaId: row.areaId,
});

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

export interface PqrsDetailedView {
  id: number;
  ticketNumber: string;
  description: string;
  isAutoResolved: boolean;
  dueDate: Date | null;
  appeal?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  statusId: number;
  statusName: string;
  typeId: number;
  typeName: string;
  areaId: number;
  areaName: string;
  areaCode?: string | null;
  clientId: number | bigint;
  clientName: string | null;
  clientEmail: string | null;
  clientDocument?: string | null;
  clientPhone?: string | null;
  typePersonId?: number | null;
  typePersonName?: string | null;
  stakeholderId?: number | null;
  stakeholderName?: string | null;
}

export interface PqrsTicketArea {
  ticketNumber: string;
  areaCode: string | null;
}

export interface PqrsBotResponseView {
  id?: number;
  ticketNumber: string | null;
  description: string | null;
  updatedAt: Date | null;
  statusName: string | null;
  typeName: string | null;
  areaName: string | null;
  clientName: string | null;
  typePersonName: string | null;
  responseContent: string | null;
  responseSentAt: Date | null;
  responseChannel: number | null;
  responseResponsibleId: number | null;
  responsibleName: string | null;
  responsibleEmail: string | null;
  responsibleAreaName: string | null;
  chatId: number | string | null;
  analysisId: number | null;
  analysisAnswer: string | null;
  analysisActionTaken: string | null;
  reanalysisAnswer: string | null;
  reanalysisActionTaken: string | null;
}

export class PqrsRepository {
  private readonly table = "pqrs";

  async create(data: CreatePqrsDTO): Promise<IPqrs> {
    const created = await prisma.pqrs.create({
      data: {
        ticketNumber: data.ticketNumber,
        isAutoResolved: data.isAutoResolved,
        dueDate: data.dueDate,
        appeal: data.appeal ?? null,
        pqrsStatusId: data.pqrsStatusId,
        clientId: data.clientId,
        typePqrsId: data.typePqrsId,
        areaId: data.areaId,
      },
      select: pqrsSelect,
    });
    return toPqrs(created);
  }

  async findById(id: number): Promise<IPqrs | null> {
    const found = await prisma.pqrs.findUnique({
      where: { id },
      select: pqrsSelect,
    });
    return found ? toPqrs(found) : null;
  }

  async findAll(): Promise<IPqrs[]> {
    const rows = await prisma.pqrs.findMany({
      orderBy: { id: "asc" },
      select: pqrsSelect,
    });
    return rows.map(toPqrs);
  }

  async findByTicketNumber(ticketNumber: string): Promise<IPqrs | null> {
    const found = await prisma.pqrs.findUnique({
      where: { ticketNumber },
      select: pqrsSelect,
    });
    return found ? toPqrs(found) : null;
  }

  async findNextCreatedAtByClientId(clientId: bigint, createdAt: Date): Promise<Date | null> {
    const found = await prisma.pqrs.findFirst({
      where: {
        clientId,
        createdAt: { gt: createdAt },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });
    return found?.createdAt ?? null;
  }

  async findAllWithFilters(filters: PqrsFilters): Promise<IPqrs[]> {
    const where: {
      pqrsStatusId?: number;
      areaId?: number;
      typePqrsId?: number;
      clientId?: bigint;
      ticketNumber?: string;
      createdAt?: { gte?: Date; lte?: Date };
    } = {};

    if (filters.pqrsStatusId !== undefined) where.pqrsStatusId = filters.pqrsStatusId;
    if (filters.areaId !== undefined) where.areaId = filters.areaId;
    if (filters.typePqrsId !== undefined) where.typePqrsId = filters.typePqrsId;
    if (filters.clientId !== undefined) where.clientId = filters.clientId;
    if (filters.ticketNumber !== undefined) where.ticketNumber = filters.ticketNumber;
    if (filters.fromDate !== undefined || filters.toDate !== undefined) {
      where.createdAt = {
        ...(filters.fromDate ? { gte: filters.fromDate } : {}),
        ...(filters.toDate ? { lte: filters.toDate } : {}),
      };
    }

    const rows = await prisma.pqrs.findMany({
      where,
      orderBy: { id: "asc" },
      select: pqrsSelect,
    });
    return rows.map(toPqrs);
  }

  async findSeguimientoDetailed() {
    return prisma.$queryRaw(Prisma.sql`SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
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
       ORDER BY p.created_at DESC`);
  }

  async findApelacionesDetailed() {
    return prisma.$queryRaw(Prisma.sql`SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
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
       WHERE p.pqrs_status_id IN (3, 5)
       ORDER BY p.created_at DESC`);
  }

  async findCerradasDetailed() {
    return prisma.$queryRaw(Prisma.sql`SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
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
       ORDER BY p.updated_at DESC`);
  }

  async findAllDetailed(filters: PqrsDetailedFilters): Promise<unknown[]> {
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

    const result = await prisma.$queryRawUnsafe(
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
      ...values
    );
    return result as unknown[];
  }

  async findDetailedById(id: number): Promise<PqrsDetailedView | null> {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
              p.is_auto_resolved AS "isAutoResolved",
              p.due_date AS "dueDate",
              p.appeal,
              p.created_at AS "createdAt",
              p.updated_at AS "updatedAt",
              s.id AS "statusId",
              s.name AS "statusName",
              t.id AS "typeId",
              t.name AS "typeName",
              a.id AS "areaId",
              a.name AS "areaName",
              a.code AS "areaCode",
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
       WHERE p.id = ${id}`
    );
    return (result as PqrsDetailedView[])[0] ?? null;
  }

  async findTicketAndAreaCode(pqrsId: number): Promise<PqrsTicketArea | null> {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT p.ticket_number AS "ticketNumber",
              a.code AS "areaCode"
       FROM pqrs p
       JOIN area a ON a.id = p.area_id
       WHERE p.id = ${pqrsId}`
    );
    return (result as PqrsTicketArea[])[0] ?? null;
  }

  async findDetailedByTicketNumber(ticketNumber: string): Promise<PqrsDetailedView | null> {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT p.id,
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
       WHERE p.ticket_number = ${ticketNumber}`
    );
    return (result as PqrsDetailedView[])[0] ?? null;
  }

  async findBotResponseByTicketNumber(ticketNumber: string): Promise<PqrsBotResponseView | null> {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT p.id,
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
              analysis.answer AS "analysisAnswer",
              analysis.action_taken AS "analysisActionTaken",
              reanalysis.answer AS "reanalysisAnswer",
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
         SELECT id, answer, action_taken, created_at
         FROM analysis
         WHERE pqrs_id = p.id
           AND (resp.responsible_id IS NULL OR responsible_id = resp.responsible_id)
         ORDER BY
           (resp.sent_at IS NOT NULL AND created_at <= resp.sent_at) DESC,
           created_at DESC NULLS LAST,
           id DESC
         LIMIT 1
       ) analysis ON true
       LEFT JOIN LATERAL (
         SELECT answer, action_taken, created_at
         FROM reanalysis
         WHERE analysis_id = analysis.id
         ORDER BY created_at DESC NULLS LAST, id DESC
         LIMIT 1
       ) reanalysis ON true
       LEFT JOIN chat ON chat.client_id = p.client_id
       WHERE p.ticket_number = ${ticketNumber}`
    );
    return (result as PqrsBotResponseView[])[0] ?? null;
  }

  async findBotResponseByPqrsId(pqrsId: number): Promise<PqrsBotResponseView | null> {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT p.id,
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
              analysis.answer AS "analysisAnswer",
              analysis.action_taken AS "analysisActionTaken",
              reanalysis.answer AS "reanalysisAnswer",
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
         SELECT id, answer, action_taken, created_at
         FROM analysis
         WHERE pqrs_id = p.id
           AND (resp.responsible_id IS NULL OR responsible_id = resp.responsible_id)
         ORDER BY
           (resp.sent_at IS NOT NULL AND created_at <= resp.sent_at) DESC,
           created_at DESC NULLS LAST,
           id DESC
         LIMIT 1
       ) analysis ON true
       LEFT JOIN LATERAL (
         SELECT answer, action_taken, created_at
         FROM reanalysis
         WHERE analysis_id = analysis.id
         ORDER BY created_at DESC NULLS LAST, id DESC
         LIMIT 1
       ) reanalysis ON true
       LEFT JOIN chat ON chat.client_id = p.client_id
       WHERE p.id = ${pqrsId}`
    );
    return (result as PqrsBotResponseView[])[0] ?? null;
  }

  async update(data: UpdatePqrsDTO): Promise<IPqrs | null> {
    const updateData: {
      ticketNumber?: string;
      isAutoResolved?: boolean;
      dueDate?: Date | null;
      appeal?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
      pqrsStatusId?: number;
      clientId?: bigint;
      typePqrsId?: number;
      areaId?: number;
    } = {};

    if (data.ticketNumber !== undefined) updateData.ticketNumber = data.ticketNumber;
    if (data.isAutoResolved !== undefined) updateData.isAutoResolved = data.isAutoResolved;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.appeal !== undefined) updateData.appeal = data.appeal;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;
    if (data.updatedAt !== undefined) updateData.updatedAt = data.updatedAt;
    if (data.pqrsStatusId !== undefined) updateData.pqrsStatusId = data.pqrsStatusId;
    if (data.clientId !== undefined) updateData.clientId = data.clientId;
    if (data.typePqrsId !== undefined) updateData.typePqrsId = data.typePqrsId;
    if (data.areaId !== undefined) updateData.areaId = data.areaId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.pqrs.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeletePqrsDTO): Promise<boolean> {
    const deleted = await prisma.pqrs.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
