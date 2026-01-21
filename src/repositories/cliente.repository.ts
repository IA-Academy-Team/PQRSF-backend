import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { ICliente } from "../models/cliente.model";
import { CreateClienteDTO, UpdateClienteDTO, DeleteClienteDTO } from "../DTOs/cliente.dto";

export class ClienteRepository {
  private readonly table = "client";

  async create(data: CreateClienteDTO): Promise<ICliente> {
    const result = await pool.query(
      `INSERT INTO client (id, name, document, email, phone_number, type_person_id, stakeholder_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, document, email, phone_number AS "phoneNumber", type_person_id AS "typePersonId", stakeholder_id AS "stakeholderId"`,
      normalizeValues([data.id, data.name, data.document, data.email, data.phoneNumber, data.typePersonId, data.stakeholderId])
    );
    return result.rows[0];
  }

  async findById(id: bigint): Promise<ICliente | null> {
    const result = await pool.query(
      `SELECT id, name, document, email, phone_number AS "phoneNumber", type_person_id AS "typePersonId", stakeholder_id AS "stakeholderId" FROM client WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<ICliente[]> {
    const result = await pool.query(`SELECT id, name, document, email, phone_number AS "phoneNumber", type_person_id AS "typePersonId", stakeholder_id AS "stakeholderId" FROM client ORDER BY id`);
    return result.rows;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<ICliente | null> {
    const result = await pool.query(
      `SELECT id, name, document, email, phone_number AS "phoneNumber", type_person_id AS "typePersonId", stakeholder_id AS "stakeholderId" FROM client WHERE phone_number = $1`,
      normalizeValues([phoneNumber])
    );
    return result.rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<ICliente | null> {
    const result = await pool.query(
      `SELECT id, name, document, email, phone_number AS "phoneNumber", type_person_id AS "typePersonId", stakeholder_id AS "stakeholderId" FROM client WHERE email = $1`,
      normalizeValues([email])
    );
    return result.rows[0] ?? null;
  }

  async update(data: UpdateClienteDTO): Promise<ICliente | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.name !== undefined) {
      fields.push(`name = $${index}`);
      values.push(data.name);
      index += 1;
    }
    if (data.document !== undefined) {
      fields.push(`document = $${index}`);
      values.push(data.document);
      index += 1;
    }
    if (data.email !== undefined) {
      fields.push(`email = $${index}`);
      values.push(data.email);
      index += 1;
    }
    if (data.phoneNumber !== undefined) {
      fields.push(`phone_number = $${index}`);
      values.push(data.phoneNumber);
      index += 1;
    }
    if (data.typePersonId !== undefined) {
      fields.push(`type_person_id = $${index}`);
      values.push(data.typePersonId);
      index += 1;
    }
    if (data.stakeholderId !== undefined) {
      fields.push(`stakeholder_id = $${index}`);
      values.push(data.stakeholderId);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as bigint);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE client SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name, document, email, phone_number AS "phoneNumber", type_person_id AS "typePersonId", stakeholder_id AS "stakeholderId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteClienteDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM client WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
