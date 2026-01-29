import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export type ErrorDetails = Record<string, unknown>;

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: ErrorDetails;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    details?: ErrorDetails
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

const mapPostgresError = (error: unknown) => {
  if (!error || typeof error !== "object") return null;
  const pgError = error as { code?: string; detail?: string; constraint?: string };
  if (!pgError.code) return null;

  if (pgError.code === "23505") {
    return new AppError(
      "Unique constraint violation",
      409,
      "CONFLICT",
      { detail: pgError.detail, constraint: pgError.constraint }
    );
  }
  if (pgError.code === "23503") {
    return new AppError(
      "Foreign key constraint violation",
      409,
      "CONFLICT",
      { detail: pgError.detail, constraint: pgError.constraint }
    );
  }
  if (pgError.code === "22P02") {
    return new AppError(
      "Invalid input syntax",
      400,
      "VALIDATION_ERROR",
      { detail: pgError.detail }
    );
  }

  return null;
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const sanitize = (value: unknown): unknown => {
    if (typeof value === "bigint") return value.toString();
    if (Array.isArray(value)) return value.map(sanitize);
    if (value && typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>).map(
        ([key, val]) => [key, sanitize(val)]
      );
      return Object.fromEntries(entries);
    }
    return value;
  };

  if (err instanceof AppError) {
    if (err.statusCode >= 400 && err.statusCode < 500) {
      console.warn("[Request Error]", {
        method: req.method,
        path: req.originalUrl,
        code: err.code,
        message: err.message,
        details: sanitize(err.details),
      });
    }
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: sanitize(err.details),
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: {
          issues: err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
    });
  }

  const mapped = mapPostgresError(err);
  if (mapped) {
    return res.status(mapped.statusCode).json({
      error: {
        code: mapped.code,
        message: mapped.message,
        details: sanitize(mapped.details),
      },
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Unexpected error",
    },
  });
};
