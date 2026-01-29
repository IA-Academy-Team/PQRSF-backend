import { Request, Response } from "express";
import { EncuestaService } from "../services/encuesta.service";
import { PqrsService } from "../services/pqrs.service";
import { asyncHandler } from "../utils/controller.utils";
import {
  createEncuestaSchema,
  createPublicEncuestaSchema,
  deleteEncuestaSchema,
  updateEncuestaSchema,
} from "../schemas/encuesta.schema";
import { AppError } from "../middlewares/error.middleware";
import { requireString } from "../utils/validation.utils";

const service = new EncuestaService();
const pqrsService = new PqrsService();

const PQRS_STATUS = {
  CERRADO: 4,
} as const;

export const createEncuesta = asyncHandler(async (req: Request, res: Response) => {
  const data = createEncuestaSchema.parse(req.body);
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getEncuestaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteEncuestaSchema.parse(req.params);
  const result = await service.findById(id);
  res.json(result);
});

export const getEncuestaByPqrs = asyncHandler(async (req: Request, res: Response) => {
  const pqrsId = Number(req.params.pqrsfId);
  const result = await service.findByPqrsId(pqrsId);
  res.json(result);
});

export const listEncuestasDetailed = asyncHandler(async (_req: Request, res: Response) => {
  const result = await service.listDetailed();
  res.json(result);
});

export const getPublicSurveyByTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticketNumber = requireString(req.params.ticketNumber, "ticketNumber");
  const pqrs = await pqrsService.findDetailedByTicketNumber(ticketNumber);
  if (pqrs.statusId !== PQRS_STATUS.CERRADO) {
    throw new AppError(
      "La encuesta solo esta disponible para PQRS cerradas",
      409,
      "SURVEY_NOT_AVAILABLE",
      { ticketNumber, statusId: pqrs.statusId }
    );
  }

  const existing = await service.findOptionalByPqrsId(pqrs.id);
  if (existing) {
    throw new AppError(
      "Esta encuesta ya fue respondida",
      409,
      "SURVEY_ALREADY_SUBMITTED",
      { ticketNumber, pqrsId: pqrs.id }
    );
  }

  res.json({
    pqrs: {
      id: pqrs.id,
      ticketNumber: pqrs.ticketNumber,
      description: pqrs.description,
      createdAt: pqrs.createdAt,
      areaName: pqrs.areaName,
      typeName: pqrs.typeName,
      statusName: pqrs.statusName,
      clientName: pqrs.clientName,
    },
  });
});

export const createPublicSurveyByTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticketNumber = requireString(req.params.ticketNumber, "ticketNumber");
  const body = createPublicEncuestaSchema.parse(req.body);
  const pqrs = await pqrsService.findDetailedByTicketNumber(ticketNumber);
  const result = await service.create({ ...body, pqrsId: pqrs.id });
  res.status(201).json(result);
});

export const updateEncuesta = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteEncuestaSchema.parse(req.params);
  const body = updateEncuestaSchema.parse(req.body);
  const data = { ...body, id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteEncuesta = asyncHandler(async (req: Request, res: Response) => {
  const { id } = deleteEncuestaSchema.parse(req.params);
  const result = await service.delete({ id });
  res.json({ deleted: result });
});
