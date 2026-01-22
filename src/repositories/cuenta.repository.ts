import pool from "../config/db.config";
import { normalizeValues } from "./repository.utils";
import { ICuenta } from "../models/cuenta.model";
import { CreateCuentaDTO, UpdateCuentaDTO, DeleteCuentaDTO } from "../schemas/cuenta.schema";

export class CuentaRepository {
  private readonly table = "accounts";

  async create(data: CreateCuentaDTO): Promise<ICuenta> {
    const result = await pool.query(
      `INSERT INTO accounts (provider_id, provider_account_id, password, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, provider_id AS "providerId", provider_account_id AS "providerAccountId", password, access_token AS "accessToken", refresh_token AS "refreshToken", id_token AS "idToken", access_token_expires_at AS "accessTokenExpiresAt", refresh_token_expires_at AS "refreshTokenExpiresAt", scope, created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId"`,
      normalizeValues([data.providerId, data.providerAccountId, data.password, data.accessToken, data.refreshToken, data.idToken, data.accessTokenExpiresAt, data.refreshTokenExpiresAt, data.scope, data.userId])
    );
    return result.rows[0];
  }

  async findById(id: number): Promise<ICuenta | null> {
    const result = await pool.query(
      `SELECT id, provider_id AS "providerId", provider_account_id AS "providerAccountId", password, access_token AS "accessToken", refresh_token AS "refreshToken", id_token AS "idToken", access_token_expires_at AS "accessTokenExpiresAt", refresh_token_expires_at AS "refreshTokenExpiresAt", scope, created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId" FROM accounts WHERE id = $1`,
      normalizeValues([id])
    );
    return result.rows[0] ?? null;
  }

  async findAll(): Promise<ICuenta[]> {
    const result = await pool.query(`SELECT id, provider_id AS "providerId", provider_account_id AS "providerAccountId", password, access_token AS "accessToken", refresh_token AS "refreshToken", id_token AS "idToken", access_token_expires_at AS "accessTokenExpiresAt", refresh_token_expires_at AS "refreshTokenExpiresAt", scope, created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId" FROM accounts ORDER BY id`);
    return result.rows;
  }

  async findByProvider(
    providerId: string,
    providerAccountId: string
  ): Promise<ICuenta | null> {
    const result = await pool.query(
      `SELECT id, provider_id AS "providerId", provider_account_id AS "providerAccountId", password, access_token AS "accessToken", refresh_token AS "refreshToken", id_token AS "idToken", access_token_expires_at AS "accessTokenExpiresAt", refresh_token_expires_at AS "refreshTokenExpiresAt", scope, created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId" FROM accounts WHERE provider_id = $1 AND provider_account_id = $2`,
      normalizeValues([providerId, providerAccountId])
    );
    return result.rows[0] ?? null;
  }

  async update(data: UpdateCuentaDTO): Promise<ICuenta | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;
    if (data.providerId !== undefined) {
      fields.push(`provider_id = $${index}`);
      values.push(data.providerId);
      index += 1;
    }
    if (data.providerAccountId !== undefined) {
      fields.push(`provider_account_id = $${index}`);
      values.push(data.providerAccountId);
      index += 1;
    }
    if (data.password !== undefined) {
      fields.push(`password = $${index}`);
      values.push(data.password);
      index += 1;
    }
    if (data.accessToken !== undefined) {
      fields.push(`access_token = $${index}`);
      values.push(data.accessToken);
      index += 1;
    }
    if (data.refreshToken !== undefined) {
      fields.push(`refresh_token = $${index}`);
      values.push(data.refreshToken);
      index += 1;
    }
    if (data.idToken !== undefined) {
      fields.push(`id_token = $${index}`);
      values.push(data.idToken);
      index += 1;
    }
    if (data.accessTokenExpiresAt !== undefined) {
      fields.push(`access_token_expires_at = $${index}`);
      values.push(data.accessTokenExpiresAt);
      index += 1;
    }
    if (data.refreshTokenExpiresAt !== undefined) {
      fields.push(`refresh_token_expires_at = $${index}`);
      values.push(data.refreshTokenExpiresAt);
      index += 1;
    }
    if (data.scope !== undefined) {
      fields.push(`scope = $${index}`);
      values.push(data.scope);
      index += 1;
    }
    if (data.createdAt !== undefined) {
      fields.push(`created_at = $${index}`);
      values.push(data.createdAt);
      index += 1;
    }
    if (data.updatedAt !== undefined) {
      fields.push(`updated_at = $${index}`);
      values.push(data.updatedAt);
      index += 1;
    }
    if (data.userId !== undefined) {
      fields.push(`user_id = $${index}`);
      values.push(data.userId);
      index += 1;
    }
    if (fields.length === 0) {
      return this.findById(data.id as number);
    }
    values.push(data.id);
    const result = await pool.query(
      `UPDATE accounts SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, provider_id AS "providerId", provider_account_id AS "providerAccountId", password, access_token AS "accessToken", refresh_token AS "refreshToken", id_token AS "idToken", access_token_expires_at AS "accessTokenExpiresAt", refresh_token_expires_at AS "refreshTokenExpiresAt", scope, created_at AS "createdAt", updated_at AS "updatedAt", user_id AS "userId"`,
      normalizeValues(values)
    );
    return result.rows[0] ?? null;
  }

  async delete(data: DeleteCuentaDTO): Promise<boolean> {
    const result = await pool.query(`DELETE FROM accounts WHERE id = $1`, normalizeValues([data.id]));
    return (result.rowCount ?? 0) > 0;
  }
}
