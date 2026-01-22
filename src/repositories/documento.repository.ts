import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { IDocumento } from "../models/documento.model";
import { CreateDocumentoDTO, UpdateDocumentoDTO, DeleteDocumentoDTO } from "../DTOs/documento.dto";

export class DocumentoRepository {
  private readonly table = "document";

  async create(data: CreateDocumentoDTO): Promise<IDocumento> {
    const result = await pool.query(
      `INSERT INTO document (url, type_document_id, pqrs_id) VALUES ($1, $2, $3) RETURNING id, url, type_document_id AS "typeDocumentId", pqrs_id AS "pqrsId"`,
      normalizeValues([data.url, data.typeDocumentId, data.pqrsId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<IDocumento | null> {
    const result = await pool.query(
      `SELECT id, url, type_document_id AS "typeDocumentId", pqrs_id AS "pqrsId" FROM document WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<IDocumento[]> {
    const result = await pool.query(`SELECT id, url, type_document_id AS "typeDocumentId", pqrs_id AS "pqrsId" FROM document ORDER BY id`);
    return result.rows;
  }

  async update(data: UpdateDocumentoDTO): Promise<IDocumento | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.url !== undefined) {
      fields.push(`url = $${index}`);
      values.push(data.url);
      index += 1;
    }
    if (data.typeDocumentId !== undefined) {
      fields.push(`type_document_id = $${index}`);
      values.push(data.typeDocumentId);
      index += 1;
    }
    if (data.pqrsId !== undefined) {
      fields.push(`pqrs_id = $${index}`);
      values.push(data.pqrsId);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE document SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, url, type_document_id AS "typeDocumentId", pqrs_id AS "pqrsId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteDocumentoDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM document WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
