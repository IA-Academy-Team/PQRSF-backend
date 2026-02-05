import prisma from "../config/db.config";
import { Prisma } from "../../generated/prisma/client";

export class DashboardService {
  async getAdminMetrics() {
    const totals = await prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*)::int AS total FROM pqrs
    `;
    const byStatus = await prisma.$queryRaw<
      { statusId: number; statusName: string; count: number }[]
    >`SELECT p.pqrs_status_id AS "statusId", s.name AS "statusName", COUNT(*)::int AS count
       FROM pqrs p
       JOIN pqrs_status s ON s.id = p.pqrs_status_id
       GROUP BY p.pqrs_status_id, s.name
       ORDER BY p.pqrs_status_id`;
    const byType = await prisma.$queryRaw<
      { typeId: number; typeName: string; count: number }[]
    >`SELECT t.id AS "typeId", t.name AS "typeName", COUNT(*)::int AS count
       FROM pqrs p
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       GROUP BY t.id, t.name
       ORDER BY t.id`;
    const avgResponseByArea = await prisma.$queryRaw<
      { areaId: number; areaName: string; avgDays: number }[]
    >`SELECT a.id AS "areaId", a.name AS "areaName",
              COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (p.updated_at - p.created_at)) / 86400)::numeric, 1), 0) AS "avgDays"
       FROM pqrs p
       JOIN area a ON a.id = p.area_id
       WHERE p.pqrs_status_id = 4
       GROUP BY a.id, a.name
       ORDER BY "avgDays" ASC`;
    const surveyAverage = await prisma.$queryRaw<{ avgScore: number }[]
    >`SELECT COALESCE(ROUND(AVG((q1_clarity + q2_timeliness + q3_quality + q4_attention + q5_overall) / 5.0)::numeric, 1), 0) AS "avgScore"
       FROM survey`;
    const chats = await prisma.$queryRaw<{ total: number }[]
    >`
      SELECT COUNT(*)::int AS total FROM chat
    `;
    const clients = await prisma.$queryRaw<{ total: number }[]
    >`
      SELECT COUNT(*)::int AS total FROM client
    `;

    return {
      totalPqrs: totals[0]?.total ?? 0,
      totalChats: chats[0]?.total ?? 0,
      totalClients: clients[0]?.total ?? 0,
      byStatus,
      byType,
      avgResponseByArea,
      surveyAverage: surveyAverage[0]?.avgScore ?? 0,
    };
  }

  async getAdminChats() {
    return prisma.$queryRaw<
      {
        chatId: number;
        mode: string | null;
        clientId: string | null;
        clientName: string | null;
        lastMessage: string | null;
        lastMessageAt: Date | null;
        ticketNumber: string | null;
      }[]
    >`SELECT c.id AS "chatId",
              c.mode,
              c.client_id::text AS "clientId",
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
       LIMIT 10`;
  }

  async getAreaMetrics(areaId: number) {
    const totals = await prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*)::int AS total
      FROM pqrs
      WHERE area_id = ${areaId}
    `;
    const byStatus = await prisma.$queryRaw<{ statusId: number; count: number }[]>`
      SELECT pqrs_status_id AS "statusId", COUNT(*)::int AS count
      FROM pqrs
      WHERE area_id = ${areaId}
      GROUP BY pqrs_status_id
      ORDER BY pqrs_status_id
    `;
    return {
      totalPqrs: totals[0]?.total ?? 0,
      byStatus,
    };
  }

  async getAreaPending(areaId: number) {
    return prisma.$queryRaw<
      {
        id: number;
        ticketNumber: string;
        description: string;
        isAutoResolved: boolean;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        pqrsStatusId: number;
        clientId: string;
        clientName: string | null;
        typePqrsId: number;
        typeName: string;
        areaId: number;
        areaName: string;
        analysisAnswer: string | null;
        responseContent: string | null;
        responseSentAt: Date | null;
      }[]
    >(Prisma.sql`SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
              p.is_auto_resolved AS "isAutoResolved",
              p.due_date AS "dueDate",
              p.created_at AS "createdAt",
              p.updated_at AS "updatedAt",
              p.pqrs_status_id AS "pqrsStatusId",
              p.client_id::text AS "clientId",
              c.name AS "clientName",
              p.type_pqrs_id AS "typePqrsId",
              t.name AS "typeName",
              p.area_id AS "areaId",
              a.name AS "areaName",
              analysis.answer AS "analysisAnswer",
              response.content AS "responseContent",
              response.sent_at AS "responseSentAt"
       FROM pqrs p
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       LEFT JOIN client c ON c.id = p.client_id
       LEFT JOIN LATERAL (
         SELECT answer
         FROM analysis
         WHERE pqrs_id = p.id
         ORDER BY created_at DESC
         LIMIT 1
       ) analysis ON true
       LEFT JOIN LATERAL (
         SELECT content, sent_at
         FROM response
         WHERE pqrs_id = p.id
         ORDER BY sent_at DESC
         LIMIT 1
       ) response ON true
       WHERE p.area_id = ${areaId} AND p.pqrs_status_id != 4
       ORDER BY p.created_at DESC`);
  }

  async getAreaAppeals(areaId: number) {
    return prisma.$queryRaw<
      {
        id: number;
        ticketNumber: string;
        description: string;
        isAutoResolved: boolean;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        pqrsStatusId: number;
        clientId: string;
        clientName: string | null;
        typePqrsId: number;
        typeName: string;
        areaId: number;
        areaName: string;
        analysisAnswer: string | null;
        responseContent: string | null;
        responseSentAt: Date | null;
      }[]
    >(Prisma.sql`SELECT p.id,
              p.ticket_number AS "ticketNumber",
              p.description,
              p.is_auto_resolved AS "isAutoResolved",
              p.due_date AS "dueDate",
              p.created_at AS "createdAt",
              p.updated_at AS "updatedAt",
              p.pqrs_status_id AS "pqrsStatusId",
              p.client_id::text AS "clientId",
              c.name AS "clientName",
              p.type_pqrs_id AS "typePqrsId",
              t.name AS "typeName",
              p.area_id AS "areaId",
              a.name AS "areaName",
              analysis.answer AS "analysisAnswer",
              response.content AS "responseContent",
              response.sent_at AS "responseSentAt"
       FROM pqrs p
       JOIN type_pqrs t ON t.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       LEFT JOIN client c ON c.id = p.client_id
       LEFT JOIN LATERAL (
         SELECT answer
         FROM analysis
         WHERE pqrs_id = p.id
         ORDER BY created_at DESC
         LIMIT 1
       ) analysis ON true
       LEFT JOIN LATERAL (
         SELECT content, sent_at
         FROM response
         WHERE pqrs_id = p.id
         ORDER BY sent_at DESC
         LIMIT 1
       ) response ON true
       WHERE p.area_id = ${areaId} AND p.pqrs_status_id IN (3, 5)
       ORDER BY p.created_at DESC`);
  }
}
