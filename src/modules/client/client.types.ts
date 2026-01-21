export interface IClient {
  id: bigint;
  name: string | null;
  document: string | null;
  email: string | null;
  phoneNumber: string | null;
  typePersonId: number | null;
  stakeholderId: number | null;
}

export type CreateClientDTO = IClient;
export type UpdateClientDTO = Partial<Omit<IClient, "id">> & { id: bigint };
export type DeleteClientDTO = { id: bigint };
