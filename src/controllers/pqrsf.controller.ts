import { Request, Response } from "express";
import { PqrsService } from "../services/pqrs.service";
import { AnalisisService } from "../services/analisis.service";
import { ReanalisisService } from "../services/reanalisis.service";
import { RespuestaService } from "../services/respuesta.service";
import { DocumentoService } from "../services/documento.service";
import { EncuestaService } from "../services/encuesta.service";
import { asyncHandler } from "../utils/controller.utils";
import { pqrsListQuerySchema } from "../schemas/pqrs.schema";
import { createAnalisisSchema, updateAnalisisSchema } from "../schemas/analisis.schema";
import { createReanalisisSchema, updateReanalisisSchema } from "../schemas/reanalisis.schema";
import { createRespuestaSchema, updateRespuestaSchema } from "../schemas/respuesta.schema";
import { createDocumentoSchema } from "../schemas/documento.schema";
import { createEncuestaSchema, updateEncuestaSchema } from "../schemas/encuesta.schema";

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
  res.json(result);
});

export const appealPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await pqrsService.appeal(pqrsId);
  res.json(result);
});

export const listSeguimiento = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pqrsService.list({ pqrsStatusId: 2 });
  res.json(result);
});

export const listApelaciones = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pqrsService.list({ pqrsStatusId: 3 });
  res.json(result);
});

export const listCerradas = asyncHandler(async (_req: Request, res: Response) => {
  const result = await pqrsService.list({ pqrsStatusId: 4 });
  res.json(result);
});
