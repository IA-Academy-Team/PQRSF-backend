import { Request, Response } from "express";
import { DocumentoService } from "../services/documento.service";
import { CreateDocumentoDTO, UpdateDocumentoDTO } from "../DTOs/documento.dto";
import { asyncHandler, parseNumberParam } from "./controller.utils";

const service = new DocumentoService();

export const createDocumento = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateDocumentoDTO;
  const result = await service.create(data);
  res.status(201).json(result);
});

export const getDocumentoById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.findById(id as number);
  res.json(result);
});

export const updateDocumento = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const data = { ...(req.body as UpdateDocumentoDTO), id };
  const result = await service.update(data);
  res.json(result);
});

export const deleteDocumento = asyncHandler(async (req: Request, res: Response) => {
  const id = parseNumberParam(req.params.id, "id");
  const result = await service.delete({ id } as { id: number });
  res.json({ deleted: result });
});
