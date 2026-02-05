import { AppError } from "../middlewares/error.middleware";

const badRequest = (message: string, details?: Record<string, unknown>) =>
  new AppError(message, 400, "VALIDATION_ERROR", details);

export const requireString = (value: unknown, field: string) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw badRequest(`${field} must be a non-empty string`, { field });
  }
  return value.trim();
};

export const optionalString = (value: unknown, field: string) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return requireString(value, field);
};

export const requireEmail = (value: unknown, field: string) => {
  const email = requireString(value, field).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw badRequest(`${field} must be a valid email`, { field });
  }
  return email;
};

export const optionalEmail = (value: unknown, field: string) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return requireEmail(value, field);
};

export const requireBoolean = (value: unknown, field: string) => {
  if (typeof value !== "boolean") {
    throw badRequest(`${field} must be a boolean`, { field });
  }
  return value;
};

export const optionalBoolean = (value: unknown, field: string) => {
  if (value === undefined) return undefined;
  return requireBoolean(value, field);
};

export const requireNumber = (value: unknown, field: string) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw badRequest(`${field} must be a number`, { field });
  }
  return value;
};

export const requirePositiveInt = (value: unknown, field: string) => {
  const num = requireNumber(value, field);
  if (!Number.isInteger(num) || num <= 0) {
    throw badRequest(`${field} must be a positive integer`, { field });
  }
  return num;
};

export const optionalPositiveInt = (value: unknown, field: string) => {
  if (value === undefined) return undefined;
  return requirePositiveInt(value, field);
};

export const requireBigInt = (value: unknown, field: string) => {
  if (typeof value === "bigint") return value;
  if (typeof value === "number" && Number.isInteger(value)) {
    return BigInt(value);
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return BigInt(value);
  }
  throw badRequest(`${field} must be a bigint`, { field });
};

export const optionalBigInt = (value: unknown, field: string) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return requireBigInt(value, field);
};

export const requireDate = (value: unknown, field: string) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }
  throw badRequest(`${field} must be a valid date`, { field });
};

export const optionalDate = (value: unknown, field: string) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return requireDate(value, field);
};

export const ensureUpdates = (
  data: Record<string, unknown>,
  fields: string[],
  entity: string
) => {
  const hasAny = fields.some((field) => data[field] !== undefined);
  if (!hasAny) {
    throw badRequest(`At least one field is required to update ${entity}`, {
      entity,
      fields,
    });
  }
};

export const ensureEnum = <T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[]
) => {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw badRequest(`${field} must be one of: ${allowed.join(", ")}`, {
      field,
      allowed,
    });
  }
  return value as T;
};

export const ensureFound = <T>(
  entity: string,
  value: T | null,
  identifiers: Record<string, unknown>
): T => {
  if (!value) {
    throw new AppError(`${entity} not found`, 404, "NOT_FOUND", identifiers);
  }
  return value;
};

export const normalizeValues = (values: unknown[]): unknown[] => {
  return values.map((value) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "bigint") return value.toString();
    if (Array.isArray(value)) return value.map((item) => normalizeValues([item]));
    if (value && typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>).map(
        ([key, val]) => [key, normalizeValues([val])[0]]
      );
      return Object.fromEntries(entries);
    }
    return value;
  });
};
