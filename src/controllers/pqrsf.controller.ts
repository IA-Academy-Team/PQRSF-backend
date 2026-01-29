import { Request, Response } from "express";
import { PqrsService } from "../services/pqrs.service";
import { AnalisisService } from "../services/analisis.service";
import { ReanalisisService } from "../services/reanalisis.service";
import { RespuestaService } from "../services/respuesta.service";
import { DocumentoService } from "../services/documento.service";
import { EncuestaService } from "../services/encuesta.service";
import { asyncHandler } from "../utils/controller.utils";
import { requirePositiveInt } from "../utils/validation.utils";
import { AppError } from "../middlewares/error.middleware";
import { pqrsListDetailedQuerySchema, pqrsListQuerySchema } from "../schemas/pqrs.schema";
import { notifyN8n } from "../services/chat-integration.service";
import { FRONTEND_URL } from "../config/env.config";
import { createAnalisisSchema, updateAnalisisSchema } from "../schemas/analisis.schema";
import { createReanalisisSchema, updateReanalisisSchema } from "../schemas/reanalisis.schema";
import { createRespuestaSchema, updateRespuestaSchema } from "../schemas/respuesta.schema";
import { createDocumentoSchema } from "../schemas/documento.schema";
import { createEncuestaSchema, updateEncuestaSchema } from "../schemas/encuesta.schema";
import { uploadToS3 } from "../services/s3.service";

const pqrsService = new PqrsService();
const analisisService = new AnalisisService();
const reanalisisService = new ReanalisisService();
const respuestaService = new RespuestaService();
const documentoService = new DocumentoService();
const encuestaService = new EncuestaService();

export const getPqrsByRadicado = asyncHandler(async (req: Request, res: Response) => {
  const result = await pqrsService.findByTicketNumber(req.params.code as string);
  res.json(result);
});

export const listPqrsByStatus = asyncHandler(async (req: Request, res: Response) => {
  const statusId = Number(req.params.statusId);
  const result = await pqrsService.list({ pqrsStatusId: statusId });
  res.json(result);
});

export const listPqrsByType = asyncHandler(async (req: Request, res: Response) => {
  const typeId = Number(req.params.typeId);
  const result = await pqrsService.list({ typePqrsId: typeId });
  res.json(result);
});

export const listPqrsByUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await pqrsService.list({ clientId: userId as unknown as bigint });
  res.json(result);
});

export const listPqrsByArea = asyncHandler(async (req: Request, res: Response) => {
  const areaId = Number(req.params.areaId);
  const result = await pqrsService.list({ areaId });
  res.json(result);
});

export const listPqrsDetailed = asyncHandler(async (req: Request, res: Response) => {
  const filters = pqrsListDetailedQuerySchema.parse(req.query);
  const result = await pqrsService.listDetailed(filters);
  res.json(result);
});

export const getPqrsDetailedById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.pqrsfId);
  const result = await pqrsService.findDetailedById(id);
  res.json(result);
});

export const searchPqrs = asyncHandler(async (req: Request, res: Response) => {
  const filters = pqrsListQuerySchema.parse(req.query);
  const result = await pqrsService.list(filters);
  res.json(result);
});

export const listAnalisisByPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await analisisService.listByPqrsId(pqrsId);
  res.json(result);
});

export const createAnalisis = asyncHandler(async (req: Request, res: Response) => {
  const data = createAnalisisSchema.parse(req.body);
  const result = await analisisService.create(data);
  res.status(201).json(result);
});

export const updateAnalisis = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const body = updateAnalisisSchema.parse(req.body);
  const result = await analisisService.update({ ...body, id });
  res.json(result);
});

export const getReanalisisById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await reanalisisService.findById(id);
  res.json(result);
});

export const getReanalisisByPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await reanalisisService.findByPqrsId(pqrsId);
  if (!result) {
    throw new AppError("Reanalysis not found", 404, "NOT_FOUND", { pqrsId });
  }
  res.json(result);
});

export const createReanalisis = asyncHandler(async (req: Request, res: Response) => {
  const data = createReanalisisSchema.parse(req.body);
  const result = await reanalisisService.create(data);
  res.status(201).json(result);
});

export const updateReanalisis = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const body = updateReanalisisSchema.parse(req.body);
  const result = await reanalisisService.update({ ...body, id });
  res.json(result);
});

export const listResponsesByPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await respuestaService.listByPqrsId(pqrsId);
  res.json(result);
});

export const createResponseForPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const body = createRespuestaSchema.parse({ ...req.body, pqrsId });
  const result = await respuestaService.create(body);
  res.status(201).json(result);
});

export const updateResponse = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const body = updateRespuestaSchema.parse(req.body);
  const result = await respuestaService.update({ ...body, id });
  res.json(result);
});

export const listDocumentsByPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await documentoService.listByPqrsId(pqrsId);
  res.json(result);
});

export const createDocumentForPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const body = createDocumentoSchema.parse({ ...req.body, pqrsId });
  const result = await documentoService.create(body);
  res.status(201).json(result);
});

export const uploadDocumentsForPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = requirePositiveInt(Number(req.params.pqrsfId), "pqrsId");
  const rawTypeDocumentId = req.body?.typeDocumentId;
  const typeDocumentId = requirePositiveInt(Number(rawTypeDocumentId), "typeDocumentId");
  const files = (req as Request & { files?: Express.Multer.File[] }).files ?? [];

  if (!files.length) {
    throw new AppError("No files received", 400, "VALIDATION_ERROR", { field: "files" });
  }

  const { ticketNumber, areaCode } = await pqrsService.findTicketAndAreaCode(pqrsId);
  const prefix = areaCode ? `${areaCode}/${ticketNumber}` : `${ticketNumber}`;

  const created: unknown[] = [];
  for (const file of files) {
    const key = `pqrs/${prefix}/${Date.now()}_${file.originalname}`;
    const url = await uploadToS3({
      key,
      body: file.buffer,
      contentType: file.mimetype,
    });
    console.info("[pqrsf][documents] uploaded", {
      pqrsId,
      typeDocumentId,
      key,
      url,
      originalName: file.originalname,
    });
    const doc = await documentoService.create({
      url,
      typeDocumentId,
      pqrsId,
    });
    created.push(doc);
  }

  res.status(201).json(created);
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = await documentoService.delete({ id });
  res.json({ deleted });
});

export const downloadDocument = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const doc = await documentoService.findById(id);
  res.json({ url: doc.url });
});

export const getSurveyByPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await encuestaService.findByPqrsId(pqrsId);
  res.json(result);
});

export const createSurvey = asyncHandler(async (req: Request, res: Response) => {
  const data = createEncuestaSchema.parse(req.body);
  const result = await encuestaService.create(data);
  res.status(201).json(result);
});

export const updateSurvey = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const body = updateEncuestaSchema.parse(req.body);
  const result = await encuestaService.update({ ...body, id });
  res.json(result);
});

export const finalizePqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await pqrsService.finalize(pqrsId);
  try {
    const data = await pqrsService.findBotResponseByPqrsId(pqrsId);
    if (data?.ticketNumber && data?.chatId) {
      const baseUrl = FRONTEND_URL || "http://localhost:5173";
      const surveyLink = `${baseUrl.replace(/\/$/, "")}/survey/${data.ticketNumber}`;
      await notifyN8n({
        encuesta_pqrs: {
          ticket_number: data.ticketNumber,
          link: surveyLink,
          chat_id: String(data.chatId),
        },
      });
    }
  } catch (err) {
    console.warn("[pqrsf][finalize] survey webhook error", err);
  }
  res.json(result);
});

export const appealPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await pqrsService.appeal(pqrsId);
  try {
    const analysisList = await analisisService.listByPqrsId(pqrsId);
    const latestAnalysis = analysisList[analysisList.length - 1];
    if (latestAnalysis?.id) {
      const reanalysis = await reanalisisService.findByPqrsId(pqrsId);
      if (reanalysis?.id) {
        await reanalisisService.update({
          id: reanalysis.id,
          createdAt: new Date(),
          analysisId: latestAnalysis.id,
          responsibleId: latestAnalysis.responsibleId,
        });
      } else {
        await reanalisisService.create({
          analysisId: latestAnalysis.id,
          responsibleId: latestAnalysis.responsibleId,
          answer: null,
          actionTaken: null,
        });
      }
    }
  } catch (err) {
    console.warn("[pqrsf][appeal] reanalysis touch failed", err);
  }
  res.json(result);
});

export const listSeguimiento = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pqrsService.listSeguimientoDetailed();
  res.json(result);
});

export const listApelaciones = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pqrsService.listApelacionesDetailed();
  res.json(result);
});

export const listCerradas = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pqrsService.listCerradasDetailed();
  res.json(result);
});

const splitActions = (value: string | null | undefined): string[] => {
  if (!value) return [];
  return value
    .split(/\r?\n|;|•|- /g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const formatDateEs = (value: string | Date | null | undefined): string => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const resolveSolicitante = (data: {
  clientName: string | null;
  typePersonName: string | null;
}) => {
  const isAnon =
    data.typePersonName?.toLowerCase() === "anónimo" ||
    data.typePersonName?.toLowerCase() === "anonimo" ||
    !data.clientName;
  return {
    nombre: isAnon ? "Anónimo" : data.clientName ?? "Anónimo",
    es_anonimo: isAnon,
  };
};

export const getPqrsBotResponseByTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticketNumber = req.params.ticketNumber as string;
  const data = await pqrsService.findBotResponseByTicketNumber(ticketNumber);

  if (!data.responseContent) {
    throw new AppError("Response not available", 404, "NOT_FOUND", { ticketNumber });
  }

  const actionsSource = data.reanalysisActionTaken ?? data.analysisActionTaken ?? null;
  const actions = splitActions(actionsSource);
  const solicitante = resolveSolicitante({
    clientName: data.clientName ?? null,
    typePersonName: data.typePersonName ?? null,
  });

  const payload = {
    respuesta_pqrs: {
      ticket_number: data.ticketNumber,
      fecha_respuesta: formatDateEs(data.responseSentAt ?? data.updatedAt ?? null),
      tipo_pqrs: data.typeName,
      area: data.areaName,
      estado: data.statusName,
      solicitante,
      descripcion_original: data.description,
      respuesta: data.responseContent,
      acciones: actions,
      responsable: {
        nombre: data.responsibleName ?? "Responsable",
        cargo: data.responsibleAreaName ?? "Responsable",
        email: data.responsibleEmail ?? "",
      },
      canal_respuesta: {
        chat_id: data.chatId ? String(data.chatId) : "",
      },
    },
  };

  await notifyN8n(payload);
  res.json(payload);
});

export const getPqrsBotResponse = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = requirePositiveInt(req.body?.pqrsId, "pqrsId");
  const data = await pqrsService.findBotResponseByPqrsId(pqrsId);

  if (!data.responseContent) {
    throw new AppError("Response not available", 404, "NOT_FOUND", { pqrsId });
  }

  const actionsSource = data.reanalysisActionTaken ?? data.analysisActionTaken ?? null;
  const actions = splitActions(actionsSource);
  const solicitante = resolveSolicitante({
    clientName: data.clientName ?? null,
    typePersonName: data.typePersonName ?? null,
  });

  const payload = {
    respuesta_pqrs: {
      ticket_number: data.ticketNumber,
      fecha_respuesta: formatDateEs(data.responseSentAt ?? data.updatedAt ?? null),
      tipo_pqrs: data.typeName,
      area: data.areaName,
      estado: data.statusName,
      solicitante,
      descripcion_original: data.description,
      respuesta: data.responseContent,
      acciones: actions,
      responsable: {
        nombre: data.responsibleName ?? "Responsable",
        cargo: data.responsibleAreaName ?? "Responsable",
        email: data.responsibleEmail ?? "",
      },
      canal_respuesta: {
        chat_id: data.chatId ? String(data.chatId) : "",
      },
    },
  };

  await notifyN8n(payload);
  res.json(payload);
});
