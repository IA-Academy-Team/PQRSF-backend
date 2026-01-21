export type PQRSStatus =
  | "RADICADO"
  | "ANALISIS"
  | "REANALISIS"
  | "CERRADO";

export interface PQRS {
  id: string;
  ticketNumber: string;
  clientId: string;
  areaId: number;
  status: PQRSStatus;
  dueDate: Date;
  isAutoResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
