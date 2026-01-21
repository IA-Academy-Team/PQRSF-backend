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
