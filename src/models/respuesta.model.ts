export interface IRespuesta {
  id: number;
  content: string;
  channel: number;
  sentAt: Date;
  documentId: number | null;
  pqrsId: number;
  responsibleId: number;
}
