import { Request, Response } from "express";
import { RespuestaService } from "../services/respuesta.service";
import { CreateRespuestaDTO, UpdateRespuestaDTO } from "../DTOs/respuesta.dto";
import { asyncHandler, parseNumberParam } from "./controller.utils";

const service = new RespuestaService();

export const createRespuesta = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateRespuestaDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getRespuestaById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateRespuesta = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateRespuestaDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteRespuesta = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
