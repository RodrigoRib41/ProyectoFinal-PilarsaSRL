import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorPayload(error: unknown) {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      message: "Los datos enviados no son validos.",
      details: error.flatten(),
    };
  }

  if (isAppError(error)) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    };
  }

  return {
    statusCode: 500,
    message: "Ocurrio un error inesperado.",
    details: undefined,
  };
}
