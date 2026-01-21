export interface IDocument {
  id: number;
  url: string;
  typeDocumentId: number;
  pqrsId: number;
}

export type CreateDocumentDTO = Omit<IDocument, "id">;
export type UpdateDocumentDTO = Partial<CreateDocumentDTO> & { id: number };
export type DeleteDocumentDTO = { id: number };
