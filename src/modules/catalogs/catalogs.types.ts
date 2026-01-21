export interface IArea {
  id: number;
  name: string;
  code: string | null;
}

export interface ITypePerson {
  id: number;
  name: string;
}

export interface IStakeholder {
  id: number;
  name: string;
}

export interface ITypePqrs {
  id: number;
  name: string;
}

export interface IPqrsStatus {
  id: number;
  name: string;
}

export interface ITypeDocument {
  id: number;
  name: string;
}

export type CreateAreaDTO = Omit<IArea, "id">;
export type UpdateAreaDTO = Partial<CreateAreaDTO> & { id: number };
export type DeleteAreaDTO = { id: number };

export type CreateTypePersonDTO = Omit<ITypePerson, "id">;
export type UpdateTypePersonDTO = Partial<CreateTypePersonDTO> & { id: number };
export type DeleteTypePersonDTO = { id: number };

export type CreateStakeholderDTO = Omit<IStakeholder, "id">;
export type UpdateStakeholderDTO = Partial<CreateStakeholderDTO> & {
  id: number;
};
export type DeleteStakeholderDTO = { id: number };

export type CreateTypePqrsDTO = Omit<ITypePqrs, "id">;
export type UpdateTypePqrsDTO = Partial<CreateTypePqrsDTO> & { id: number };
export type DeleteTypePqrsDTO = { id: number };

export type CreatePqrsStatusDTO = Omit<IPqrsStatus, "id">;
export type UpdatePqrsStatusDTO = Partial<CreatePqrsStatusDTO> & {
  id: number;
};
export type DeletePqrsStatusDTO = { id: number };

export type CreateTypeDocumentDTO = Omit<ITypeDocument, "id">;
export type UpdateTypeDocumentDTO = Partial<CreateTypeDocumentDTO> & {
  id: number;
};
export type DeleteTypeDocumentDTO = { id: number };
