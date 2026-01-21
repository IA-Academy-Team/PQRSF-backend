export type PQRSStatus =
  | "RADICADO"
  | "ANALISIS"
  | "REANALISIS"
  | "CERRADO";

export interface IPqrs {
  id: number;
  ticketNumber: string;
  isAutoResolved: boolean;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  pqrsStatusId: number;
  clientId: bigint;
  typePqrsId: number;
  areaId: number;
}

export type PQRS = IPqrs;

export type CreatePqrsDTO = Omit<IPqrs, "id" | "createdAt" | "updatedAt">;
export type UpdatePqrsDTO = Partial<CreatePqrsDTO> & { id: number };
export type DeletePqrsDTO = { id: number };
