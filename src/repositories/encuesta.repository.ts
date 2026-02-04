import prisma from "../config/db.config";
import { IEncuesta, IEncuestaDetailed } from "../models/encuesta.model";
import { CreateEncuestaDTO, UpdateEncuestaDTO, DeleteEncuestaDTO } from "../schemas/encuesta.schema";

const surveySelect = {
  id: true,
  q1Clarity: true,
  q2Timeliness: true,
  q3Quality: true,
  q4Attention: true,
  q5Overall: true,
  comment: true,
  pqrsId: true,
  createdAt: true,
} as const;

const toEncuesta = (row: {
  id: number;
  q1Clarity: number | null;
  q2Timeliness: number | null;
  q3Quality: number | null;
  q4Attention: number | null;
  q5Overall: number | null;
  comment: string | null;
  pqrsId: number;
  createdAt: Date | null;
}): IEncuesta => ({
  id: row.id,
  q1Clarity: row.q1Clarity,
  q2Timeliness: row.q2Timeliness,
  q3Quality: row.q3Quality,
  q4Attention: row.q4Attention,
  q5Overall: row.q5Overall,
  comment: row.comment,
  pqrsId: row.pqrsId,
  createdAt: row.createdAt ?? new Date(),
});

export class EncuestaRepository {
  private readonly table = "survey";

  async create(data: CreateEncuestaDTO): Promise<IEncuesta> {
    const created = await prisma.survey.create({
      data: {
        q1Clarity: data.q1Clarity,
        q2Timeliness: data.q2Timeliness,
        q3Quality: data.q3Quality,
        q4Attention: data.q4Attention,
        q5Overall: data.q5Overall,
        comment: data.comment,
        pqrsId: data.pqrsId,
      },
      select: surveySelect,
    });
    return toEncuesta(created);
  }

  async findById(id: number): Promise<IEncuesta | null> {
    const found = await prisma.survey.findUnique({
      where: { id },
      select: surveySelect,
    });
    return found ? toEncuesta(found) : null;
  }

  async findAll(): Promise<IEncuesta[]> {
    const rows = await prisma.survey.findMany({
      orderBy: { id: "asc" },
      select: surveySelect,
    });
    return rows.map(toEncuesta);
  }

  async findByPqrsId(pqrsId: number): Promise<IEncuesta | null> {
    const found = await prisma.survey.findFirst({
      where: { pqrsId },
      select: surveySelect,
    });
    return found ? toEncuesta(found) : null;
  }

  async findAllDetailed(): Promise<IEncuestaDetailed[]> {
    return prisma.$queryRaw<IEncuestaDetailed[]>(Prisma.sql`SELECT s.id,
              s.q1_clarity AS "q1Clarity",
              s.q2_timeliness AS "q2Timeliness",
              s.q3_quality AS "q3Quality",
              s.q4_attention AS "q4Attention",
              s.q5_overall AS "q5Overall",
              s.comment,
              s.pqrs_id AS "pqrsId",
              s.created_at AS "createdAt",
              p.ticket_number AS "ticketNumber",
              p.description AS "pqrsDescription",
              p.created_at AS "pqrsCreatedAt",
              p.updated_at AS "pqrsUpdatedAt",
              st.id AS "statusId",
              st.name AS "statusName",
              tp.id AS "typeId",
              tp.name AS "typeName",
              a.id AS "areaId",
              a.name AS "areaName",
              c.id AS "clientId",
              c.name AS "clientName",
              c.email AS "clientEmail",
              c.document AS "clientDocument",
              c.phone_number AS "clientPhone"
       FROM survey s
       JOIN pqrs p ON p.id = s.pqrs_id
       JOIN pqrs_status st ON st.id = p.pqrs_status_id
       JOIN type_pqrs tp ON tp.id = p.type_pqrs_id
       JOIN area a ON a.id = p.area_id
       JOIN client c ON c.id = p.client_id
       ORDER BY s.created_at DESC`);
  }

  async update(data: UpdateEncuestaDTO): Promise<IEncuesta | null> {
    const updateData: {
      q1Clarity?: number | null;
      q2Timeliness?: number | null;
      q3Quality?: number | null;
      q4Attention?: number | null;
      q5Overall?: number | null;
      comment?: string | null;
      pqrsId?: number;
      createdAt?: Date;
    } = {};

    if (data.q1Clarity !== undefined) updateData.q1Clarity = data.q1Clarity;
    if (data.q2Timeliness !== undefined) updateData.q2Timeliness = data.q2Timeliness;
    if (data.q3Quality !== undefined) updateData.q3Quality = data.q3Quality;
    if (data.q4Attention !== undefined) updateData.q4Attention = data.q4Attention;
    if (data.q5Overall !== undefined) updateData.q5Overall = data.q5Overall;
    if (data.comment !== undefined) updateData.comment = data.comment;
    if (data.pqrsId !== undefined) updateData.pqrsId = data.pqrsId;
    if (data.createdAt !== undefined) updateData.createdAt = data.createdAt;

    if (Object.keys(updateData).length === 0) {
      return this.findById(data.id as number);
    }

    const updated = await prisma.survey.updateMany({
      where: { id: data.id as number },
      data: updateData,
    });

    if (updated.count === 0) return null;
    return this.findById(data.id as number);
  }

  async delete(data: DeleteEncuestaDTO): Promise<boolean> {
    const deleted = await prisma.survey.deleteMany({
      where: { id: data.id },
    });
    return deleted.count > 0;
  }
}
