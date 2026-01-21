import { PqrsRepository } from "./pqrs.repository";
import { PQRSStatus } from "./pqrs.types";
import { CreatePqrsDTO } from "./pqrs.types";
import { generateTicket } from "../../utils/ticket.utils";
import { calculateDueDate } from "../../utils/date.utils";

export class PqrsService {
  constructor(private repo = new PqrsRepository()) {}

  async createPqrs(data: CreatePqrsDTO) {
    const ticketNumber = generateTicket();

    const pqrs = await this.repo.create({
      ticketNumber,
      clientId: data.clientId,
      areaId: data.areaId,
      pqrsStatusId: 1,
      dueDate: calculateDueDate(15),
      isAutoResolved: data.isAutoResolved,
    });

    return pqrs;
  }

  validateTransition(current: PQRSStatus, next: PQRSStatus) {
    const allowed = {
      RADICADO: ["ANALISIS", "CERRADO"],
      ANALISIS: ["REANALISIS", "CERRADO"],
      REANALISIS: ["CERRADO"],
    };

    if (!allowed[current]?.includes(next)) {
      throw new Error(`Transición inválida: ${current} → ${next}`);
    }
  }
}
