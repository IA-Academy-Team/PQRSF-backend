import { NextFunction, Request, Response } from "express";

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
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  const mapped = mapPostgresError(err);
  if (mapped) {
    return res.status(mapped.statusCode).json({
      error: {
        code: mapped.code,
        message: mapped.message,
        details: mapped.details,
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
