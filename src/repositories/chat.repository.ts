import prisma from "../config/db.config";
import { Prisma } from "../../generated/prisma/client";
import { IChat, IChatSummary, IChatPqrsSummary } from "../models/chat.model";
import { CreateChatDTO, UpdateChatDTO, DeleteChatDTO } from "../schemas/chat.schema";

const chatSelect = {
  id: true,
  mode: true,
  clientId: true,
} as const;

const toChat = (row: { id: bigint; mode: number | null; clientId: bigint | null }): IChat => ({
  id: row.id,
  mode: row.mode,
  clientId: row.clientId,
});

export class ChatRepository {
  private readonly table = "chat";

  async create(data: CreateChatDTO): Promise<IChat> {
    const created = await prisma.chat.create({
      data: {
        id: data.id,
        mode: data.mode,
        clientId: data.clientId,
      },
      select: chatSelect,
    });
    return toChat(created);
  }

  async findById(id: bigint): Promise<IChat | null> {
    const found = await prisma.chat.findUnique({
      where: { id },
      select: chatSelect,
    });
    return found ? toChat(found) : null;
  }

  async findAll(): Promise<IChat[]> {
    const rows = await prisma.chat.findMany({
      orderBy: { id: "asc" },
      select: chatSelect,
    });
    return rows.map(toChat);
  }

  async findAllSummaries(): Promise<IChatSummary[]> {
    return prisma.$queryRaw<IChatSummary[]>(Prisma.sql`SELECT chat.id,
              chat.mode,
              chat.client_id AS "clientId",
              COALESCE(client.name, 'Usuario WhatsApp') AS "clientName",
              COALESCE(client.phone_number, chat.client_id::text) AS "clientPhone",
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
       ORDER BY last_message.created_at DESC NULLS LAST, chat.id DESC`);
  }

  async findByClientId(clientId: bigint): Promise<IChat | null> {
    const found = await prisma.chat.findFirst({
      where: { clientId },
      select: chatSelect,
    });
    return found ? toChat(found) : null;
  }

  async findByAreaId(areaId: number): Promise<IChat[]> {
    const rows = await prisma.$queryRaw<{ id: bigint; mode: number | null; clientId: bigint | null }[]>(
      Prisma.sql`SELECT DISTINCT chat.id, chat.mode, chat.client_id AS "clientId"
       FROM chat
       JOIN pqrs ON pqrs.client_id = chat.client_id
       WHERE pqrs.area_id = ${areaId}
       ORDER BY chat.id`
    );
    return rows.map(toChat);
  }

  async findAllSummariesByPqrs(): Promise<IChatPqrsSummary[]> {
    return prisma.$queryRaw<IChatPqrsSummary[]>(Prisma.sql`SELECT pqrs.id AS "pqrsId",
              pqrs.ticket_number AS "ticketNumber",
              pqrs.pqrs_status_id AS "statusId",
              pqrs.created_at AS "pqrsCreatedAt",
              next_pqrs.created_at AS "pqrsEndAt",
              chat.id,
              chat.mode,
              chat.client_id AS "clientId",
              CASE
                WHEN anon_window.is_anon = true THEN 'Anónimo'
                WHEN LOWER(tp.name) IN ('anónimo', 'anonimo') OR client.name IS NULL THEN 'Anónimo'
                ELSE client.name
              END AS "clientName",
              CASE
                WHEN anon_window.is_anon = true THEN NULL
                WHEN LOWER(tp.name) IN ('anónimo', 'anonimo') THEN NULL
                ELSE COALESCE(client.phone_number, chat.client_id::text)
              END AS "clientPhone",
              last_message.content AS "lastMessage",
              last_message.created_at AS "lastMessageAt"
       FROM pqrs
       JOIN chat ON chat.client_id = pqrs.client_id
       LEFT JOIN client ON client.id = pqrs.client_id
       LEFT JOIN type_person tp ON tp.id = client.type_person_id
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
       LEFT JOIN LATERAL (
         SELECT EXISTS (
           SELECT 1
           FROM message m
           WHERE m.chat_id = chat.id
             AND m.created_at >= pqrs.created_at
             AND (next_pqrs.created_at IS NULL OR m.created_at < next_pqrs.created_at)
             AND m.content ILIKE '%anonim%'
         ) AS is_anon
       ) anon_window ON true
       ORDER BY pqrs.created_at DESC`);
  }

  async update(data: UpdateChatDTO): Promise<IChat | null> {
    const updateData: { mode?: number | null; clientId?: bigint } = {};

    if (data.mode !== undefined) updateData.mode = data.mode;
    if (data.clientId !== undefined) updateData.clientId = data.clientId;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as bigint);
    }

    const updated = await prisma.chat.updateMany({
      where: { id: data.id as bigint },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as bigint);
  }

  async delete(data: DeleteChatDTO): Promise<boolean> {
    const deleted = await prisma.chat.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
