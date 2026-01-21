export interface IRespuesta {
  id: number;
  content: string;
  channel: number;
  sentAt: Date;
  documentId: number;
  pqrsId: number;
  responsibleId: number;
}
