import { ICliente } from "../models/cliente.model";

export type CreateClienteDTO = ICliente;
export type UpdateClienteDTO = Partial<Omit<ICliente, "id">> & { id: bigint };
export type DeleteClienteDTO = { id: bigint };
