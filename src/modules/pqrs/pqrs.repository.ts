import pool from "../../config/db";
import { PQRS } from "./pqrs.types";

export class PqrsRepository {
  async create(data: Partial<PQRS>): Promise<PQRS> {
    return pool.pqrs.create({ data });
  }

  async findById(id: string): Promise<PQRS | null> {
    return pool.pqrs.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    return pool.pqrs.update({
      where: { id },
      data: { status },
    });
  }
}
