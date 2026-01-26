export interface IEncuesta {
  id: number;
  q1Clarity: number | null;
  q2Timeliness: number | null;
  q3Quality: number | null;
  q4Attention: number | null;
  q5Overall: number | null;
  comment: string | null;
  pqrsId: number;
  createdAt: Date;
}

export interface IEncuestaDetailed extends IEncuesta {
  ticketNumber: string;
  pqrsDescription: string;
  pqrsCreatedAt: Date | null;
  pqrsUpdatedAt: Date | null;
  statusId: number;
  statusName: string;
  typeId: number;
  typeName: string;
  areaId: number;
  areaName: string;
  clientId: number;
  clientName: string | null;
  clientEmail: string | null;
  clientDocument: string | null;
  clientPhone: string | null;
}
