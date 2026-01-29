import { PqrsStatusHistoryRepository } from "../repositories/pqrsStatusHistory.repository";
import { IPqrsStatusHistory } from "../models/pqrsStatusHistory.model";
import { requirePositiveInt } from "../utils/validation.utils";

export class PqrsStatusHistoryService {
  constructor(private readonly repo = new PqrsStatusHistoryRepository()) {}

  async logStatusChange(pqrsId: number, statusId: number, note?: string | null): Promise<IPqrsStatusHistory> {
    const resolvedPqrsId = requirePositiveInt(pqrsId, "pqrsId");
    const resolvedStatusId = requirePositiveInt(statusId, "statusId");
    return this.repo.create({ pqrsId: resolvedPqrsId, statusId: resolvedStatusId, note });
  }

  async listByPqrsId(pqrsId: number): Promise<IPqrsStatusHistory[]> {
    const resolvedPqrsId = requirePositiveInt(pqrsId, "pqrsId");
    return this.repo.listByPqrsId(resolvedPqrsId);
  }
}
