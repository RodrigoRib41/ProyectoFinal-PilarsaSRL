import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ZodType } from "zod";
import { AppError } from "@/lib/core/api-errors";
import { getErrorPayload } from "@/lib/core/api-errors";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type MethodHandlers = Partial<Record<ApiMethod, NextApiHandler>>;

type ApiSuccessOptions = {
  status?: number;
  meta?: Record<string, unknown>;
};

export function sendSuccess<T>(
  res: NextApiResponse,
  data: T,
  options: ApiSuccessOptions = {},
) {
  const { status = 200, meta } = options;
  if (meta) {
    return res.status(status).json({
      data,
      meta,
    });
  }

  return res.status(status).json(data);
}

export function sendEmpty(res: NextApiResponse) {
  return res.status(204).end();
}

export function sendMethodNotAllowed(res: NextApiResponse, methods: ApiMethod[]) {
  res.setHeader("Allow", methods);
  return res.status(405).json({
    message: "Metodo no permitido.",
  });
}

export function sendError(res: NextApiResponse, error: unknown) {
  const payload = getErrorPayload(error);
  if (payload.statusCode >= 500) {
    console.error(error);
  }

  return res.status(payload.statusCode).json({
    message: payload.message,
    details: payload.details,
  });
}

export function createApiHandler(handlers: MethodHandlers): NextApiHandler {
  return async (req, res) => {
    const method = req.method as ApiMethod | undefined;

    if (!method || !handlers[method]) {
      return sendMethodNotAllowed(res, Object.keys(handlers) as ApiMethod[]);
    }

    try {
      await handlers[method]?.(req, res);
    } catch (error) {
      return sendError(res, error);
    }
  };
}

export function parseIdParam(req: NextApiRequest, field = "id") {
  const rawId = req.query[field];
  const id = Array.isArray(rawId) ? Number(rawId[0]) : Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("El identificador solicitado es invalido.", 400);
  }

  return id;
}

export function parseQuery<T>(schema: ZodType<T>, req: NextApiRequest) {
  return schema.parse(req.query);
}

export function parseBody<T>(schema: ZodType<T>, req: NextApiRequest) {
  return schema.parse(req.body);
}
