import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/error.middleware";

export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const parseNumberParam = (value: unknown, field: string) => {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    throw new AppError(`${field} must be a positive integer`, 400, "VALIDATION_ERROR", {
      field,
      value,
    });
  }
  return num;
};

export const parseBigIntParam = (value: unknown, field: string) => {
  if (typeof value === "bigint") return value;
  if (typeof value === "number" && Number.isInteger(value)) return BigInt(value);
  if (typeof value === "string" && /^\d+$/.test(value)) return BigInt(value);
  throw new AppError(`${field} must be a bigint`, 400, "VALIDATION_ERROR", {
    field,
    value,
  });
};

export const parseOptionalNumberQuery = (value: unknown, field: string) => {
  if (value === undefined || value === null || value === "") return undefined;
  return parseNumberParam(value, field);
};

export const parseOptionalDateQuery = (value: unknown, field: string) => {
  if (value === undefined || value === null || value === "") return undefined;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${field} must be a valid date`, 400, "VALIDATION_ERROR", {
      field,
      value,
    });
  }
  return date;
};
