import type { NextApiRequest } from "next";
import {
  createApiHandler,
  parseIdParam,
  sendEmpty,
  sendSuccess,
} from "@/lib/core/http";
import {
  deleteAuto,
  getAutoById,
  updateAuto,
} from "@/lib/server/modules/autos";
import { requireApiRoles } from "@/lib/server/auth";
import { parseMultipartForm } from "@/lib/server/formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createApiHandler({
  async GET(req, res) {
    const id = parseIdParam(req);
    const auto = await getAutoById(id);
    return sendSuccess(res, auto);
  },
  async PUT(req, res) {
    await requireApiRoles(req, ["STOCK", "SUPERADMIN"]);
    const id = parseIdParam(req);
    const { fields, files } = await parseMultipartForm(req as NextApiRequest);
    const auto = await updateAuto(id, { fields, files });
    return sendSuccess(res, auto);
  },
  async DELETE(req, res) {
    await requireApiRoles(req, ["STOCK", "SUPERADMIN"]);
    const id = parseIdParam(req);
    await deleteAuto(id);
    return sendEmpty(res);
  },
});
